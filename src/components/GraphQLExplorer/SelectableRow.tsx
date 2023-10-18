import clsx from 'clsx'
import type { ReactNode } from 'react'

import { AddOutlined, ArrowFilled, CheckedFilled } from './Icons'

interface SelectableRowProps {
  selected?: boolean
  expandedContent?: ReactNode
  name: string
  type?: string
  onSelect: () => void
  onClick: () => void
}

const SelectableRow = ({
  selected,
  expandedContent,
  name,
  type,
  onClick,
  onSelect
}: SelectableRowProps) => {
  return (
    <div className={clsx("flex items-stretch w-full font-400 selectable-row", selected ? 'selected-row' : '')}>
      <div
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center cursor-pointer rounded hover:bg-white"
        onClick={onSelect}
      >
        {selected ? <CheckedFilled className="w-4 h-4 text-primary" /> : <AddOutlined className="w-4 h-4" />}
      </div>
      <div
        className="flex items-center px-1 h-7 group flex-1 overflow-x-hidden cursor-pointer rounded hover:bg-white"
        onClick={onClick}
      >
        <div className="flex items-center relative flex-1 overflow-x-hidden">
          <span>{name}:</span>
          {expandedContent && <span className="argument-more">(...)</span>}
          {expandedContent && <span>{expandedContent}</span>}
          {type && (
            <span className="ml-1 truncate text-dark-700 group-hover:text-dark-800">{type}</span>
          )}
        </div>
        <ArrowFilled className="ml-auto hidden group-hover:block w-2 h-2" />
      </div>
    </div>
  )
}

export default SelectableRow
