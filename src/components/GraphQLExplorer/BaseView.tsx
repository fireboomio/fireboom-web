import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { ExpandedIcon, ExpandIcon, SelectedCheckbox, UnselectedCheckbox } from './icons'
import { checkboxStyle } from './utils'

interface BaseViewProps {
  isArg: boolean
  name: string
  defaultExpanded?: boolean
  expandable?: boolean
  checked?: boolean
  selectable: boolean
  children?: ReactNode
  argChecked?: boolean
  valueNode?: ReactNode
  onClick?: (expanded: boolean) => void
  onCheck?: (checked: boolean) => void
  onToggleAsArgument?: () => void
}

const BaseView = ({
  isArg,
  argChecked,
  name,
  expandable = true,
  defaultExpanded,
  checked,
  selectable,
  children,
  valueNode,
  onClick,
  onCheck,
  onToggleAsArgument
}: BaseViewProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)

  const toggleExpand = useCallback(() => {
    if (expandable) {
      setExpanded(!expanded)
    }
  }, [expanded, expandable])

  const toggleCheck = useCallback(() => {
    onCheck?.(!checked)
  }, [checked, onCheck])

  const onClickName = useCallback(() => {
    setExpanded(!expanded)
    if (selectable) {
      toggleCheck()
    } else {
      onClick?.(!expanded)
    }
  }, [expanded, onClick, selectable, toggleCheck])

  const Checkbox = checked ? SelectedCheckbox : UnselectedCheckbox
  const Expand = expandable && expanded ? ExpandedIcon : ExpandIcon

  return (
    <>
      <div className="flex py-2px items-center group">
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
          className={`mr-2 cursor-pointer ${isArg ? 'text-[#8b2bb9]' : 'text-[#1f61a0]'}`}
          onClick={onClickName}
        >
          {name}
        </span>
        {isArg && (
          <button
            className="border border-solid rounded cursor-pointer bg-gray-100 border-gray-300 mr-2 py-0 px-3px text-[10px] text-[#397d13] hidden appearance-none group-hover:inline-block"
            title={argChecked ? '取消参数' : '指定为 GraphQL 参数'}
            onClick={onToggleAsArgument}
          >
            $
          </button>
        )}
        {valueNode}
      </div>
      {expandable && expanded && <div className="pl-4">{children}</div>}
    </>
  )
}

export default BaseView
