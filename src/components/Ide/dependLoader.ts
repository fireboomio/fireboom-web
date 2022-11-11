import type { Monaco } from '@swordjs/monaco-editor-react'

import requests, { NPM_RESOLVE_HOSE } from '@/lib/fetchers'

export async function dependLoader(name: string, version: string, monaco: Monaco) {
  const result = await requests.get<
    unknown,
    { types: string; dependencies: Record<string, string>; dtsFiles: Record<string, string> }
  >(`${NPM_RESOLVE_HOSE}/loadPkgTypes`, {
    params: { name, version },
    timeout: 60000
  })

  Object.keys(result.dtsFiles).forEach(key => {
    inject(monaco, name + '/' + key, result.dtsFiles[key])
  })
  Object.keys(result.dependencies || {}).forEach(key => {
    dependLoader(key, result.dependencies[key], monaco)
  })
}

function inject(monaco: Monaco, key: string, lib: string) {
  const libUri = `inmemory://model/node_modules/${key}`
  monaco.languages.typescript.typescriptDefaults.addExtraLib(lib, libUri)
  // const currentModel = monaco.editor.getModel(monaco.Uri.parse(libUri))
  // if (currentModel) {
  //   currentModel.dispose()
  // }
  // monaco.editor.createModel(lib, 'typescript', monaco.Uri.parse(libUri))
}

type Lib = {
  // 资源访问地址
  filePath: string
  // 被哪些模块依赖
  importSources: string[]
  // 内容
  content: string
}

type LocalLib = {
  // 资源访问地址
  filePath: string
  // 内容
  content: string
}

enum DependStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

type LoadResponse = {
  types: string
  dependencies: Record<string, string>
  dtsFiles: Record<string, string>
}
const loadingMap = new Map<string, Promise<LoadResponse | void>>() // 正在加载的模块或子模块

async function _loadOneDepend(
  name: string,
  version: string,
  force: boolean
): Promise<LoadResponse | void> {
  const key = `${name}@${version}`
  if (!loadingMap.has(key) || force) {
    const promise = requests
      .get<unknown, LoadResponse>(`${NPM_RESOLVE_HOSE}/loadPkgTypes`, {
        params: { name, version },
        timeout: 3 * 60000
      })
      .catch(e => {
        loadingMap.delete(key)
        console.error(e)
      })
    loadingMap.set(key, promise)
  }
  return loadingMap.get(key)
}
async function loadDepend(
  name: string,
  version: string,
  force = false
): Promise<{ dtsFiles: Record<string, string>; fails: string[] }> {
  const key = `${name}@${version}`
  const { dtsFiles, fails } = await loader(name, version)
  return { dtsFiles, fails }

  async function loader(
    name: string,
    version: string
  ): Promise<{ dtsFiles: Record<string, string>; fails: string[] }> {
    const result = await _loadOneDepend(name, version, force)
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
  private dependMap: Map<string, DependStatus>
  private localLibs: LocalLib[]
  private libs: Lib[]
  private libMap: Map<string, Lib>

  constructor(monaco: Monaco, localLibs: LocalLib[]) {
    this.monaco = monaco
    this.dependMap = new Map()
    this.libs = []
    this.libMap = new Map<string, Lib>()
    this.localLibs = localLibs
  }
  async removeDepend(name: string) {
    this.dependMap.delete(name)
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
  async addDepend(name: string, version: string, force = false) {
    try {
      console.log(111)
      const key = `${name}@${version}`
      if (this.dependMap.has(key) && !force) {
        return
      }
      this.dependMap.set(key, DependStatus.LOADING)
      const { dtsFiles, fails } = await loadDepend(name, version, force)
      console.log(222)
      // 如果依赖已经被移除，则放弃加载
      if (!this.dependMap.has(key)) {
        return
      }
      if (fails.length) {
        // TODO: 依赖加载失败
      }
      console.log(333, dtsFiles)
      Object.keys(dtsFiles).forEach(key => {
        const filePath = `inmemory://model/node_modules/${name}/${key}`
        // 已经存在的依赖不再加载，而是增加引用
        const existLib = this.libMap.get(filePath)
        if (existLib) {
          existLib.importSources.push(name)
          return
        }
        const lib = {
          filePath: filePath,
          importSources: [name],
          content: dtsFiles[key]
        }
        this.libs.push(lib)
        this.libMap.set(filePath, lib)
      })

      this.dependMap.set(key, DependStatus.LOADED)
      console.log('addDepend', this.dependMap, this.libs)
      this.monaco.languages.typescript.typescriptDefaults.setExtraLibs([
        ...this.libs,
        ...this.localLibs
      ])
    } catch (e) {
      this.dependMap.set(name, DependStatus.ERROR)
      console.error(e)
    }
  }
  setLocalLibs(libs: LocalLib[]) {
    this.localLibs = libs
    this.monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      ...this.libs,
      ...this.localLibs
    ])
  }
}
