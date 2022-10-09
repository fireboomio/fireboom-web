import { GraphQLArgument, GraphQLInputObjectType, isObjectType, isScalarType } from 'graphql'
import { useState } from 'react'

import { ExpandedIcon, ExpandIcon, UnselectedCheckbox } from './icons'
import { checkboxStyle } from './utils'

interface ArgViewProps {
  arg: GraphQLArgument
}

const ArgView = ({ arg }: ArgViewProps) => {
  const [expanded, setExpanded] = useState(false)
  const isScalar = isScalarType(arg.type)
  const isObject = isObjectType(arg.type)
  console.log('isScalar', isScalar, 'isObject', isObject)

  return (
    <>
      <div className="py-2px text-[#8b2bb9]">
        {!isScalar ? (
          expanded ? (
            <ExpandedIcon className="flex-shrink-0" onClick={() => setExpanded(false)} />
          ) : (
            <ExpandIcon className="flex-shrink-0" onClick={() => setExpanded(true)} />
          )
        ) : (
          <UnselectedCheckbox className="flex-shrink-0" style={checkboxStyle} />
        )}
        {arg.name}
      </div>
      {expanded && isObject && 111}
    </>
  )
}

export default ArgView
