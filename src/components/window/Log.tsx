/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'

import type { LogMessage } from '@/interfaces/window'

type Props = {
  log: LogMessage[]
}

const tabs = [
  { key: '1', name: '核心日志' },
  { key: '2', name: '钩子日志' }
]

// eslint-disable-next-line react/prop-types
const Log: React.FC<Props> = ({ log }) => {
  const [selectedKey, setSelectedKey] = useState('1')
  const [content, setContent] = useState('')
  const logRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    logRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [content])

  useEffect(() => {
    const displayLog = log.filter(x => x.logType.toString() === selectedKey)
    setContent(displayLog.map(x => `${x.time} ${x.level} ${x.msg}`).join('\n'))
  }, [selectedKey, log])

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      <pre className="w-9/10 h-full overflow-auto mb-0">
        {content}
        <div ref={logRef} />
      </pre>

      <div className="w-1/10 border-l">
        <ul className="list-none">
          {tabs.map(x => (
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
      </div>
    </div>
  )
}

export default Log
