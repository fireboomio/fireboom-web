import { useExecutionContext } from '@graphiql/react'
import type { ImgHTMLAttributes } from 'react'

import RunIcon from '../assets/run.svg'

type ExecuteButtonProps = ImgHTMLAttributes<HTMLImageElement>

const ExecuteButton = ({ className, ...props }: ExecuteButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { isFetching, run, stop } = useExecutionContext({
    nonNull: true,
    caller: ExecuteButton
  })

  const toggleExecute = () => {
    if (isFetching) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      stop()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      run()
    }
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <span className={`h-7 w-7 relative ${className || ''}`}>
      <img {...props} src={RunIcon} width="28" height="28" alt="run" onClick={toggleExecute} />

      {isFetching && (
        <svg
          className="h-7 text-white top-0 right-0 bottom-0 left-0 w-7 z-2 absolute"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeDasharray="15"
            strokeDashoffset="15"
            strokeLinecap="round"
            strokeWidth="2"
            d="M12 3C16.9706 3 21 7.02944 21 12"
          >
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0" />
            <animateTransform
              attributeName="transform"
              dur="1.5s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </path>
        </svg>
      )}
    </span>
  )
}

export default ExecuteButton
