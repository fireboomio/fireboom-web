import clsx from 'clsx'
import { ReactNode } from 'react'

interface IconButtonProps {
  className?: string
  children?: ReactNode
}

const IconButton = ({ className, children }: IconButtonProps) => {
  return (
    <button
      className={clsx(
        'min-w-7 h-7 flex-shrink-0 flex items-center justify-center cursor-pointer rounded hover:bg-white',
        className
      )}
    >
      {children}
    </button>
  )
}

export default IconButton
