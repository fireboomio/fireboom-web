import type { CSSProperties } from 'react'
import { useContext, useEffect, useRef } from 'react'
import useSWRImmutable from 'swr/immutable'

import { getGoTemplate, getTsTemplate } from '@/components/Ide/getDefaultCode'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { saveHookScript } from '@/lib/service/hook'

type HookOption = {
  relativeDir: string
  language: string
}

const resolveDefaultCode = async (
  path: string,
  hasParam: boolean,
  language: string
): Promise<string> => {
  let getDefaultCode
  if (language === 'go') {
    getDefaultCode = getGoTemplate
  } else {
    getDefaultCode = getTsTemplate
  }
  const list = path.split('/')
  const name = list.pop()
  const packageName = list[list.length - 1]
  let code = ''
  if (path.startsWith('global/')) {
    code = await getDefaultCode(`global.${name}`)
  } else if (path.startsWith('auth/')) {
    code = await getDefaultCode(`auth.${name}`)
  } else if (path.startsWith('customize/')) {
    code = await (await getDefaultCode('custom')).replace('$CUSTOMIZE_NAME$', name!)
  } else if (path.startsWith('uploads/')) {
    const profileName = list.pop() as string
    const storageName = list.pop() as string
    const code = (await getDefaultCode(`upload.${name}`))
      .replaceAll('$STORAGE_NAME$', storageName)
      .replace('$PROFILE_NAME$', profileName)
  } else {
    const pathList = list.slice(1)
    const tmplPath = `hook.${hasParam ? 'WithInput' : 'WithoutInput'}.${name}`
    code = (await getDefaultCode(tmplPath)).replaceAll('$HOOK_NAME$', pathList.join('__'))
  }
  return code.replaceAll('$HOOK_PACKAGE$', packageName!)
}

export default function VsCode({
  className,
  style
}: {
  className?: string
  style?: CSSProperties
}) {
  const vscodeWebIframe = useRef<HTMLIFrameElement>(null)
  const { vscode } = useContext(WorkbenchContext)
  const { data } = useSWRImmutable<HookOption>('/hook/option', requests)
  const language = data?.language
  useEffect(() => {
    if (!language || !vscode.options.currentPath) {
      return
    }
    resolveDefaultCode(
      vscode.options.currentPath,
      !!vscode.options.config?.hasParam,
      language
    ).then(code => {
      saveHookScript(vscode.options.currentPath, code)
    })
  }, [vscode.options, language])

  useEffect(() => {
    const outChannel = new BroadcastChannel('fb-vscode-out')
    const inChannel = new BroadcastChannel('fb-vscode-in')
    inChannel.onmessage = event => {
      // 在此处理VSCode Web实例返回的消息
      console.log('inChannel message:', event.data)
    }
    outChannel.onmessage = event => {
      // 在此处理VSCode Web实例返回的消息
      console.log('Received message:', event.data)
    }
    setTimeout(async () => {
      // const db = await openDatabase()
      // await addMessage(db, 'Hello World')
      // const result = await getMessages(await openDatabase())
      // console.log(result)
      // sendCommandToVscodeWeb('openFile', { path: '/file.js' })
    }, 6000)
  }, [])
  return vscode.options.visible && data?.relativeDir ? (
    <iframe
      ref={vscodeWebIframe}
      className={`border-0 h-full top-0 left-0 w-full ${className}`}
      src={`/vscode/index.html?baseDir=${data?.relativeDir}`}
      title="vscode"
      style={style}
    />
  ) : (
    <></>
  )
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fb-controller', 1)

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

// 从数据库获取所有消息
async function getMessages(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['msg'], 'readonly')
    const objectStore = transaction.objectStore('msg')
    const request = objectStore.getAll()

    request.onerror = event => {
      reject('Failed to get messages')
    }

    request.onsuccess = event => {
      resolve(event.target.result)
    }
  })
}
