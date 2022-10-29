import { Image } from 'antd'
import { Resizable } from 're-resizable'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { LogMessage } from '@/interfaces/window'
import { matchJson } from '@/lib/utils'

import RcTab from '../rc-tab'
import type { LogAction } from './Log'
import Log from './Log'

const tabs = [
  { title: '终端', key: '0' },
  { title: '问题', key: '1' }
]
interface Props {
  style: CSSProperties
  toggleWindow: () => void
}

// eslint-disable-next-line react/prop-types
const Window: React.FC<Props> = ({ style, toggleWindow }) => {
  const [tabActiveKey, setTabActiveKey] = useState('0')
  const logActionRef = useRef<LogAction>()
  const responseRef = useRef<Response>()

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    async function fn() {
      if (!responseRef.current) {
        responseRef.current = await fetch('/api/v1/wdg/log', { signal })
        const reader = responseRef.current.body!.getReader()
        const decoder = new TextDecoder()
        let result = await reader.read()
        while (!result.done) {
          const text = decoder.decode(result.value)
          console.log('log stream: ', text)
          const resps = matchJson(text) as LogMessage[]
          logActionRef.current?.appendLogs(resps)
          result = await reader.read()
        }
        console.log('Log finished')
      }
    }
    fn()
    return () => {
      console.log('close fetch')
      controller.abort()
    }
  }, [])

  const extra = (
    <div className="cursor-pointer flex justify-end">
      <div onClick={logActionRef.current?.clearLogs}>
        <img src="/assets/clear.png" height={20} width={20} alt="清空" />
      </div>
      <div className="ml-4" onClick={logActionRef.current?.downloadLogs}>
        <img src="/assets/download.png" height={20} width={20} alt="下载" />
      </div>
      <div className="ml-4" onClick={toggleWindow}>
        <img src="/assets/close.png" height={20} width={20} alt="关闭" />
      </div>
    </div>
  )

  return (
    <div
      className="bg-[#fff] border-gray-500/50 min-h-80px py-5 px-7 bottom-36px z-200  absolute"
      style={{ borderTop: '1px solid #EFEFEFFF', ...style }}
    >
      <Resizable
        className="flex flex-col h-full"
        defaultSize={{ width: '100%', height: 348 }}
        minWidth="100%"
        maxWidth="100%"
      >
        <RcTab tabs={tabs} onTabClick={setTabActiveKey} activeKey={tabActiveKey} extra={extra} />
        {tabActiveKey === '0' ? <Log actionRef={logActionRef} /> : <></>}
      </Resizable>
    </div>
  )
}

export default Window
