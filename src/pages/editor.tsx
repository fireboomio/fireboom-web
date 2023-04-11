import { useEffect, useRef } from 'react'

export default function Editor() {
  const vscodeWebIframe = useRef<HTMLIFrameElement>()
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
  return (
    <iframe
      ref={vscodeWebIframe}
      className="w-100vw h-100vh border-0"
      src="./vscode/index.html"
      title="vscode"
    />
  )
}
