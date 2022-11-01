/* eslint-disable react/prop-types */
import { Image } from 'antd'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { LogMessage } from '@/interfaces/window'

export type LogAction = {
  appendLogs: (log: LogMessage[]) => void
  clearLogs: () => void
  downloadLogs: () => void
}

type Props = {
  // log: LogMessage[]
  actionRef?: MutableRefObject<LogAction | undefined>
}

// const tabs = [
//   { key: '1', name: '核心日志' },
//   { key: '2', name: '钩子日志' }
// ]

// eslint-disable-next-line react/prop-types
const Log: React.FC<Props> = ({ actionRef }) => {
  const [logs, setLogs] = useState<LogMessage[]>([])
  // const [selectedKey, setSelectedKey] = useState('1')
  // const [content, setContent] = useState('')
  const logRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    logRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // useEffect(() => {
  //   // const displayLog = logs.filter(x => x.logType.toString() === selectedKey)
  //   setContent(logs.map(x => `${x.time} ${x.level} ${x.msg}`).join('\n'))
  // }, [logs])

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        appendLogs(_logs: LogMessage[]) {
          setLogs([...logs, ..._logs.map(item => ({ ...item, logType: item.logType || 1 }))])
        },
        clearLogs() {
          setLogs([])
        },
        downloadLogs() {
          const file = new File([logs.map(item => JSON.stringify(item)).join('\n')], 'logs.txt', {
            type: 'text/plain'
          })
          const link = document.createElement('a')
          const url = URL.createObjectURL(file)

          link.href = url
          link.download = file.name
          document.body.appendChild(link)
          link.click()

          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
      }
    }
  }, [actionRef, logs])

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      <div className="h-full mb-0 w-10/10 overflow-auto">
        {logs.map((x, idx) => (
          <div
            className="text-xs leading-25px font-normal text-[#333333]"
            style={{
              fontFamily: 'PingFangSC-Regular, PingFang SC;'
            }}
            key={idx}
          >
            <span className="mr-8">{x.time}</span>{' '}
            <span className="mr-1.5">
              <Image
                src={x.logType === 1 ? '/assets/log-core.svg' : '/assets/log-hook.svg'}
                preview={false}
              />
            </span>
            <span className="w-100 mr-1">{x.level}</span> <span>{x.msg}</span>
          </div>
        ))}

        <div ref={logRef} />
      </div>

      {/* <div className="border-l w-1/10">
        <ul className="list-none">
          {tabs.map(x => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              onClick={() => setSelectedKey(x.key)}
              className={`px-3 py-4.5 text-[#222222] cursor-pointer ${
                selectedKey === x.key ? 'bg-[#F7F7F7FF]' : ''
              }`}
              key={x.key}
            >
              {x.name}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}

export default Log
