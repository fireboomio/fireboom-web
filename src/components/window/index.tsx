import { Resizable } from 're-resizable'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { LogMessage } from '@/interfaces/window'
import { matchJson } from '@/lib/utils'

import Error from './Error'
import type { LogAction } from './Log'
import Log from './Log'
import RcTab from './rc-tab'

const tabs = [
  { title: '日志', key: '0' },
  { title: '问题', key: '1' }
]
interface Props {
  style: CSSProperties
  defaultTab?: string
  toggleWindow: () => void
}

// eslint-disable-next-line react/prop-types
const Window: React.FC<Props> = ({ style, toggleWindow, defaultTab }) => {
  const [tabActiveKey, setTabActiveKey] = useState(defaultTab ?? '0')
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
          // console.log('log stream: ', text)
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
      <div onClick={() => logActionRef.current?.clearLogs()}>
        <img src="/assets/clear.svg" height={20} width={20} alt="清空" />
      </div>
      <div className="ml-4" onClick={logActionRef.current?.downloadLogs}>
        <img src="/assets/download2.svg" height={20} width={20} alt="下载" />
      </div>
      <div className="ml-4" onClick={toggleWindow}>
        <img src="/assets/close2.svg" height={20} width={20} alt="关闭" />
      </div>
    </div>
  )

  return (
    <div
      className="bg-[#fff] border-gray-500/50 min-h-80px pb-5 px-7 bottom-36px z-200  absolute"
      style={{
        borderTop: '1px solid #EFEFEFFF',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        ...style
      }}
    >
      <Resizable
        className="flex flex-col h-full pt-5"
        defaultSize={{ width: '100%', height: 348 }}
        minWidth="100%"
        maxWidth="100%"
        enable={{ top: true }}
      >
        <RcTab tabs={tabs} onTabClick={setTabActiveKey} activeKey={tabActiveKey} extra={extra} />
        <div className={`w-full overflow-auto ${tabActiveKey === '0' ? '' : 'hidden'}`}>
          <Log actionRef={logActionRef} />{' '}
        </div>
        <div className={`w-full overflow-auto ${tabActiveKey === '1' ? '' : 'hidden'}`}>
          <Error />
        </div>
      </Resizable>
    </div>
  )
}

export default Window
