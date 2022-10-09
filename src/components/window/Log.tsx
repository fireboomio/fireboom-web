/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'

import { LogMessage } from '@/interfaces/window'

type Props = {
  log: LogMessage[]
}

const tabs = [
  { key: '1', name: '核心日志' },
  { key: '2', name: '钩子日志' },
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
    const displayLog = log.filter(x => {
      return `${x.logType}` === selectedKey
    })
    setContent(displayLog.map(x => `${x.time} ${x.level} ${x.msg}`).join('\n'))
  }, [selectedKey, log])

  return (
    <div className="flex w-full h-[calc(306px_-_28px)]">
      <pre className="w-9/10 h-full overflow-auto">
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
