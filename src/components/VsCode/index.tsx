import { useEffect, useRef } from 'react'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

type HookOption = {
  relativeDir: string
}

export default function VsCode({ visible }: { visible: boolean }) {
  const vscodeWebIframe = useRef<HTMLIFrameElement>(null)

  const { data } = useSWRImmutable<HookOption>('/hook/option', requests)

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
      const db = await openDatabase()
      await addMessage(db, 'Hello World')
      const result = await getMessages(await openDatabase())
      console.log(result)
      // sendCommandToVscodeWeb('openFile', { path: '/file.js' })
    }, 6000)
  }, [])
  return visible && data?.relativeDir ? (
    <iframe
      ref={vscodeWebIframe}
      className="border-0 h-100vh top-0 left-0 w-100vw z-2000 fixed"
      src={`/vscode/index.html?baseDir=${data?.relativeDir}`}
      title="vscode"
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
