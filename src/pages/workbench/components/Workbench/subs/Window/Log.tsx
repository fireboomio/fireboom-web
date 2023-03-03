import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

import { useGlobal } from '@/hooks/global'

export type LogAction = {
  clearLogs: () => void
  downloadLogs: () => void
}

type Props = {
  actionRef?: MutableRefObject<LogAction | undefined>
}

const Log: React.FC<Props> = ({ actionRef }) => {
  const logRef = useRef(null)

  const { logs, setLogs } = useGlobal(state => ({ logs: state.logs, setLogs: state.setLogs }))

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
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
            className="font-normal text-xs text-[#333333] leading-25px hover:bg-gray-100"
            key={idx}
          >
            <span className="mr-8">{x.time}</span>{' '}
            <span
              className="mr-1 w-100"
              style={{
                color:
                  {
                    INFO: 'blue',
                    WARN: 'yellow',
                    ERROR: 'magenta',
                    DPANIC: 'red',
                    PANIC: 'red',
                    FATAL: 'red',
                    DEBUG: 'red'
                  }[x.level] || '#333'
              }}
            >
              {x.level}
            </span>{' '}
            <span>{x.msg}</span>
          </div>
        ))}

        <div ref={logRef} />
      </div>
    </div>
  )
}

export default Log
