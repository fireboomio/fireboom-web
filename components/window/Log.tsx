import { useEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
const Log: React.FC<Props> = ({ children }) => {
  const logRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    logRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [children])

  return (
    <div className="h-[calc(306px_-_28px)]">
      <pre className="h-full overflow-auto">
        {children}
        <div ref={logRef} />
      </pre>
    </div>
  )
}

export default Log
