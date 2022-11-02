/* eslint-disable react/prop-types */
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

// eslint-disable-next-line react/prop-types
const Log: React.FC<Props> = ({ actionRef }) => {
  const [logs, setLogs] = useState<LogMessage[]>([])
  const logRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    logRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

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
          <div className="text-xs leading-25px font-normal text-[#333333]" key={idx}>
            <span className="mr-8">{x.time}</span>{' '}
            <span className="mr-1.5">
              <img
                src={x.logType === 1 ? '/assets/log-core.svg' : '/assets/log-hook.svg'}
                alt={x.logType === 1 ? '核心日志' : '钩子日志'}
              />
            </span>
            <span className="w-100 mr-1">{x.level}</span> <span>{x.msg}</span>
          </div>
        ))}

        <div ref={logRef} />
      </div>
    </div>
  )
}

export default Log
