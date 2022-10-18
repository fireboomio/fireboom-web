import type { ReactNode } from 'react'
import { useState } from 'react'

import { ExpandedIcon, ExpandIcon, UnselectedCheckbox } from '../icons'
import { checkboxStyle } from '../utils'

interface BaseViewProps {
  color: 'blue' | 'purple'
  name: string
  selectable: boolean
  expandedChildren?: ReactNode
}

const BaseView = ({ name, color, selectable, expandedChildren }: BaseViewProps) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className="flex py-2px items-center">
        {selectable ? (
          <UnselectedCheckbox className="flex-shrink-0" style={checkboxStyle} />
        ) : expanded ? (
          <ExpandedIcon className="flex-shrink-0" onClick={() => setExpanded(false)} />
        ) : (
          <ExpandIcon className="flex-shrink-0" onClick={() => setExpanded(true)} />
        )}
        <span className={color === 'blue' ? 'text-[#1f61a0]' : 'text-[#8b2bb9]'}>{name}</span>
      </div>
      {expanded && <div className="pl-4">{expandedChildren}</div>}
    </>
  )
}

export default BaseView
