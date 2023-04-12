import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

type HookOption = {
  relativeDir: string
}

export default function VsCode({
  visible,
  className,
  style
}: {
  visible: boolean
  className?: string
  style?: CSSProperties
}) {
  const vscodeWebIframe = useRef<HTMLIFrameElement>(null)

  const { data } = useSWRImmutable<HookOption>('/hook/option', requests)

  useEffect(() => {
    console.log('========', vscodeWebIframe)

    function sendCommandToVscodeWeb(command, data) {
      if (!vscodeWebIframe.current || !vscodeWebIframe.current.contentWindow) {
        return
      }
      console.log('gogogogogogo')
      vscodeWebIframe.current.contentWindow.postMessage({
        command: command,
        data: data
      })
    }
    window.addEventListener('message', event => {
      // 在此处理VSCode Web实例返回的消息
      console.log('Received message:', event.data)
    })
    setTimeout(() => {
      sendCommandToVscodeWeb('openFile', { path: '/file.js' })
    }, 6000)
  }, [])
  return visible && data?.relativeDir ? (
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
