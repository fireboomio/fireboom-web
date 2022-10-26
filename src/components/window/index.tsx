import { Image } from 'antd'
import { Resizable } from 're-resizable'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

import type { LogMessage } from '@/interfaces/window'

import RcTab from '../rc-tab'
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
  const [log, setLog] = useState<LogMessage[]>([])
  const [msg, setMsg] = useState<LogMessage>()

  useEffect(() => {
    void fetch(`/api/v1/wdg/log`).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) return

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)
          void data.json().then((x: LogMessage) => setMsg(x))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
        // @ts-ignore
        void reader.read().then(process)
      }

      // @ts-ignore
      void reader.read().then(process)
    })
  }, [])

  useEffect(() => {
    if (!msg) return

    setLog(log.concat(msg))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg])

  const extra = (
    <div className="cursor-pointer flex justify-end">
      <div className="">
        <Image
          src="/assets/clear.png"
          height={20}
          width={20}
          alt="清空"
          preview={false}
          onClick={() => setLog([])}
        />
      </div>
      <div className="ml-4">
        <Image src="/assets/download.png" height={20} width={20} alt="下载" preview={false} />
      </div>
      <div className="ml-4">
        <Image
          src="/assets/close.png"
          height={20}
          width={20}
          alt="关闭"
          preview={false}
          onClick={toggleWindow}
        />
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
        {tabActiveKey === '0' ? <Log log={log} /> : <></>}
      </Resizable>
    </div>
  )
}

export default Window
