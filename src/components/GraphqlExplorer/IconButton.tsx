import { Dropdown } from 'antd'
import clsx from 'clsx'
import type { MouseEventHandler, ReactNode } from 'react'

import { DropdownArrowOutlined } from './Icons'

interface IconButtonProps {
  className?: string
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const IconButton = ({ className, children, onClick }: IconButtonProps) => {
  return (
    <button
      className={clsx(
        'min-w-7 h-7 flex-shrink-0 flex items-center justify-center cursor-pointer rounded bg-transparent hover:bg-white border-none text-dark-800',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default IconButton

export const IconButtonMore = ({
  className,
  items
}: IconButtonProps & {
  items: string[]
}) => {
  return (
    <Dropdown
      trigger={['click']}
      menu={{ items: items.map((i, index) => ({ key: index, label: i })) }}
    >
      <button
        className={clsx(
          'group relative flex items-center flex-shrink-0 justify-center h-7 w-4 hover:bg-true-gray-300 focus:bg-true-gray-300 border-none bg-transparent p-0 cursor-pointer rounded-tr rounded-br text-dark-800',
          className
        )}
      >
        <DropdownArrowOutlined className="w-1.5" />
      </button>
    </Dropdown>
  )
}
