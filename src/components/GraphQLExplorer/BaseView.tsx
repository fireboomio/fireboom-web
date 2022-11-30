import { ReactNode, useCallback } from 'react'
import { useState } from 'react'

import { ExpandedIcon, ExpandIcon, UnselectedCheckbox } from './icons'
import { checkboxStyle } from './utils'

interface BaseViewProps {
  color: 'blue' | 'purple'
  name: string
  selectable: boolean
  children?: ReactNode
  onClick?: () => void
}

const BaseView = ({ name, color, selectable, children, onClick }: BaseViewProps) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  const onClickName = useCallback(() => {
    setExpanded(!expanded)
    onClick?.()
  }, [expanded, onClick])

  return (
    <>
      <div className="flex py-2px items-center">
        {selectable ? (
          <UnselectedCheckbox className="cursor-pointer flex-shrink-0" style={checkboxStyle} />
        ) : expanded ? (
          <ExpandedIcon className="cursor-pointer flex-shrink-0" onClick={toggleExpand} />
        ) : (
          <ExpandIcon className="cursor-pointer flex-shrink-0" onClick={toggleExpand} />
        )}
        <span className={`cursor-pointer ${color === 'blue' ? 'text-[#1f61a0]' : 'text-[#8b2bb9]'}`} onClick={onClickName}>{name}</span>
      </div>
      {expanded && <div className="pl-4">{children}</div>}
    </>
  )
}

export default BaseView
