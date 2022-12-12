import type { Monaco } from '@swordjs/monaco-editor-react'
import { difference } from 'lodash'

import requests, { NPM_RESOLVE_HOSE } from '@/lib/fetchers'

const STORAGE_KEY = '_dts_cache_'

const loadMap = new Map<string, Promise<LoadResponse | void>>() // 请求缓存，用于防止重复请求
const memoryCacheMap = new Map<string, LoadResponse>()
function readCache(key: string) {
  // 如果memoryCacheMap中有缓存，则直接返回
  const memoryCache = memoryCacheMap.get(key)
  if (memoryCache) {
    return memoryCache
  }
  // 如果localStorage中有缓存，则写入loadMap并返回
  const cache = localStorage.getItem(STORAGE_KEY + key)
  if (cache) {
    loadMap.set(key, JSON.parse(cache))
    return loadMap.get(key)
  }
  return null
}
function saveCache(key: string, value: LoadResponse) {
  memoryCacheMap.set(key, value)
  localStorage.setItem(STORAGE_KEY + key, JSON.stringify(value))
}

function removeCache(key: string) {
  memoryCacheMap.delete(key)
  localStorage.removeItem(STORAGE_KEY + key)
}

type Lib = {
  // 资源访问地址
  filePath: string
  // 被哪些模块依赖
  importSources: string[]
  // 内容
  content: string
}

export type LocalLib = {
  // 资源访问地址
  filePath: string
  // 内容
  content: string
  name: string
}

type LoadResponse = {
  types: string
  dependencies: Record<string, string>
  dtsFiles: Record<string, string>
}

async function _loadOneDepend(name: string, version: string): Promise<LoadResponse | void> {
  const key = `${name}@${version}`
  // 如果内存或者localStorage中有缓存，则直接返回
  const cache = readCache(key)
  if (cache) {
    return cache
  }
  // 如果有相同的请求正在进行，则直接返回进行中的请求，不重复发起
  if (!loadMap.has(key)) {
    const promise = requests
      .get<unknown, LoadResponse>(`${NPM_RESOLVE_HOSE}/loadPkgTypes`, {
        params: { name, version },
        timeout: 3 * 60000
      })
      .catch(e => {
        loadMap.delete(key)
        console.error(e)
      })
    loadMap.set(key, promise)
    // 请求完成后则从promiseMap中删除，以保证下次请求能正常发起
    promise.then(res => {
      loadMap.delete(key)
      // 如果有返回值，则加入缓存
      if (res) {
        saveCache(key, res)
      }
    })
  }
  return loadMap.get(key)
}
async function loadDepend(
  name: string,
  version: string
): Promise<{ dtsFiles: Record<string, string>; fails: string[] }> {
  const { dtsFiles, fails } = await loader(name, version)
  return { dtsFiles, fails }

  async function loader(
    name: string,
    version: string
  ): Promise<{ dtsFiles: Record<string, string>; fails: string[] }> {
    const result = await _loadOneDepend(name, version)
    const dtsFiles: Record<string, string> = {}
    const fails: string[] = []
    if (!result) {
      fails.push(`${name}@${version}`)
      return { dtsFiles, fails }
    }

    // 当前包的依赖和描述文件
    const { dependencies, dtsFiles: _files } = result
    Object.assign(dtsFiles, _files)

    // 等待子包加载完成
    const promiseList = Object.keys(dependencies || {}).map(async key => {
      const version = dependencies[key]
      return await loader(key, version)
    })
    const results = await Promise.all(promiseList)
    // 将子包的描述文件合并到当前包
    results.forEach(result => {
      if (result) {
        Object.assign(dtsFiles, result.dtsFiles)
        Object.assign(dtsFiles, result.fails)
      }
    })
    return { dtsFiles, fails }
  }
}

export class DependManager {
  private monaco: Monaco
  // 依赖的模块和版本map
  private dependMap: Record<string, string>
  // 正在加载或已加载成功的版本
  private loadMap: Record<string, string>
  // private dependMap: Map<string, DependStatus>
  private localLibs: LocalLib[]
  private libs: Lib[]
  private libMap: Map<string, Lib>

  constructor(monaco: Monaco, localLibs: LocalLib[]) {
    this.monaco = monaco
    this.dependMap = {}
    this.loadMap = {}
    this.libs = []
    this.libMap = new Map<string, Lib>()
    this.localLibs = localLibs
  }
  removeDepend(name: string) {
    delete this.dependMap[name]
    this.libs = this.libs.filter(lib => {
      lib.importSources = lib.importSources.filter(source => source !== name)
      if (lib.importSources.length === 0) {
        this.libMap.delete(lib.filePath)
        return false
      }
      return true
    })
    this.monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      ...this.libs,
      ...this.localLibs
    ])
  }
  async doLoading(name: string, version: string): Promise<Record<string, string>> {
    const { dtsFiles } = await loadDepend(name, version)
    return dtsFiles
  }

  checkForLoading() {
    const needRemove = difference(Object.keys(this.loadMap), Object.keys(this.dependMap))
    needRemove.forEach(key => {
      this.removeDepend(key)
    })
    Object.keys(this.dependMap).forEach(key => {
      // 加载中，直接返回
      if (this.loadMap[key] === this.dependMap[key]) {
        return
      }
      this.loadMap[key] = this.dependMap[key]
      const currentVersion = this.dependMap[key]
      console.log('触发加载', key, currentVersion)
      this.doLoading(key, currentVersion)
        .then(dtsFiles => {
          // 当前请求已过期
          if (this.dependMap[key] !== currentVersion) {
            return
          }
          Object.keys(dtsFiles).forEach(dtsKey => {
            const filePath = `inmemory://model/node_modules/${key}/${dtsKey}`
            // 已经存在的依赖不再加载，而是增加引用
            const existLib = this.libMap.get(filePath)
            if (existLib) {
              existLib.importSources.push(key)
              return
            }
            const lib = {
              filePath: filePath,
              importSources: [key],
              content: dtsFiles[dtsKey]
            }
            this.libs.push(lib)
            this.libMap.set(filePath, lib)
          })

          console.log('加载成功', key, currentVersion)
          this.monaco.languages.typescript.typescriptDefaults.setExtraLibs([
            ...this.libs,
            ...this.localLibs
          ])
        })
        .catch(e => {
          console.error(e)
          // 如果当前请求失败，则清空加载中的标记
          if (this.loadMap[key] === currentVersion) {
            delete this.loadMap[key]
          }
        })
    })
  }
  setDepends(dependMap: Record<string, string>) {
    this.dependMap = dependMap
    this.checkForLoading()
  }
  addDepend(name: string, version: string, force = false) {
    this.dependMap[name] = version
    if (force) {
      // 强制刷新，清空加载的标记
      delete this.loadMap[name]
      // 清空请求缓存
      removeCache(`${name}@${version}`)
    }
    this.checkForLoading()
  }
  setLocalLibs(libs: LocalLib[]) {
    this.localLibs = libs
    this.monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      ...this.libs,
      ...this.localLibs
    ])
  }
}
