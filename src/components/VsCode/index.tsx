import type { CSSProperties } from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import { useDataSourceList } from '@/hooks/store/dataSource'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'

const outChannel = new BroadcastChannel('fb-vscode-out')
const inChannel = new BroadcastChannel('fb-vscode-in')

let _appended = false

export default function VsCode({
  className,
  style
}: {
  className?: string
  style?: CSSProperties
}) {
  const [appended, setAppended] = useState(_appended)
  const vscodeWebIframe = useRef<HTMLIFrameElement>(null)
  const { vscode } = useContext(GlobalContext)
  const { data } = useSWRImmutable<ApiDocuments.Sdk>('/sdk/enabledServer', requests)
  const language = data?.language
  const [forceShowPath, setForceShowPath] = useState('')
  const dict = useDict()

  const dataSourceList = useDataSourceList()
  const { pathname } = useLocation()
  useEffect(() => {
    console.log('vscode init')
  }, [])
  useEffect(() => {
    // 未获取到language前，检查钩子逻辑无法执行
    if (!language) {
      vscode.hide()
      return
    }
    setForceShowPath('')
    const [, dbId] = pathname.match(/\/workbench\/data-source\/(\d+)/) || []
    if (dbId) {
      const db = dataSourceList?.find(x => x.name === dbId)
      if (db && db.sourceType === 4) {
        vscode.show()
        const path = `${dict.customize}/customize/${db.name}`
        vscode.checkHookExist(path).then(exist => {
          setForceShowPath(path)
        })
      } else {
        vscode.hide()
      }
    } else {
      vscode.hide()
    }
  }, [dataSourceList, pathname, language])

  useEffect(() => {
    let path = forceShowPath
    if (!forceShowPath && vscode?.options?.visible) {
      path = vscode?.options?.currentPath
    }
    path = path.replace(/^(\.\/)?custom[-_]\w+\//, './')
    if (path) {
      openDatabase().then(db => {
        addMessage(db, {
          cmd: 'openFile',
          data: { path }
        }).then(() => {
          inChannel.postMessage({
            cmd: 'openFile',
            data: { path }
          })
        })
      })
    }
  }, [forceShowPath, vscode?.options])

  useEffect(() => {
    if (vscode?.options.visible) {
      if (!appended) {
        _appended = true
        setAppended(true)
      }
    }
  }, [appended, vscode?.options.visible])

  return appended && data?.outputPath ? (
    <div
      style={{
        transform: vscode?.options?.visible ? 'none' : 'translate(-100vw, 0)'
      }}
    >
      <iframe
        key={language}
        ref={vscodeWebIframe}
        data-settings='{"productConfiguration": {"nameShort": "fb-editor1","nameLong": "fb-editor2"}}'
        className={`border-0 h-full top-0 left-0 w-full ${className}`}
        src={`${import.meta.env.BASE_URL}vscode/index.html?baseDir=${data?.outputPath}`}
        title="vscode"
        style={style}
      />
    </div>
  ) : (
    <></>
  )
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fb-controller', 2)

    request.onerror = event => {
      reject('Failed to open IndexedDB')
    }

    request.onsuccess = event => {
      resolve(event.target.result)
    }

    request.onupgradeneeded = event => {
      const db = event.target.result
      db.createObjectStore('msg', { keyPath: 'id', autoIncrement: true })
    }
  })
}

// 向数据库添加消息
async function addMessage(db, message) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['msg'], 'readwrite')
    const objectStore = transaction.objectStore('msg')
    const request = objectStore.add({ content: message })

    request.onerror = event => {
      reject('Failed to add message')
    }

    request.onsuccess = event => {
      resolve(event.target.result)
    }
  })
}
