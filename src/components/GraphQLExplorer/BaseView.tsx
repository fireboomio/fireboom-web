import { ReactNode, useCallback } from 'react'
import { useState } from 'react'

import { ExpandedIcon, ExpandIcon, SelectedCheckbox, UnselectedCheckbox } from './icons'
import { checkboxStyle } from './utils'

interface BaseViewProps {
  color: 'blue' | 'purple'
  name: string
  checked?: boolean
  selectable: boolean
  children?: ReactNode
  onClick?: (expanded: boolean) => void
  onCheck?: (checked: boolean) => void
}

const BaseView = ({
  name,
  color,
  checked,
  selectable,
  children,
  onClick,
  onCheck
}: BaseViewProps) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  const toggleCheck = useCallback(() => {
    onCheck?.(!checked)
  }, [checked])

  const onClickName = useCallback(() => {
    setExpanded(!expanded)
    if (selectable) {
      toggleCheck()
    } else {
      onClick?.(!expanded)
    }
  }, [expanded, onClick])

  const Checkbox = checked ? SelectedCheckbox : UnselectedCheckbox
  const Expand = expanded ? ExpandedIcon : ExpandIcon

  return (
    <>
      <div className="flex py-2px items-center">
        {selectable ? (
          <Checkbox
            className="cursor-pointer flex-shrink-0"
            style={checkboxStyle}
            onClick={toggleCheck}
          />
        ) : (
          <Expand className="cursor-pointer flex-shrink-0" onClick={toggleExpand} />
        )}
        <span
          className={`cursor-pointer ${color === 'blue' ? 'text-[#1f61a0]' : 'text-[#8b2bb9]'}`}
          onClick={onClickName}
        >
          {name}
        </span>
      </div>
      {expanded && <div className="pl-4">{children}</div>}
    </>
  )
}

export default BaseView
