import {
  GraphQLField,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} from 'graphql'
import { useMemo, useState } from 'react'

import ArgView from './ArgView'
import { generateFieldViews, generateNonNullViews } from './ViewFactory'
import { ExpandedIcon, ExpandIcon, UnselectedCheckbox } from './icons'
import { checkboxStyle, convertGraphiQLFieldMapToArray } from './utils'

interface FieldViewProps {
  field: GraphQLField<any, any>
}

const FieldView = ({ field }: FieldViewProps) => {
  const [expanded, setExpanded] = useState(false)
  const types = useMemo(() => {
    const type = field.type
    return {
      isScale: isScalarType(type),
      isList: isListType(type),
      isNonNull: isNonNullType(type),
      isObject: isObjectType(type),
      isInterface: isInterfaceType(type),
      isUnion: isUnionType(type),
      isEnum: isEnumType(type),
      isInputObject: isInputObjectType(type)
    }
  }, [field])
  console.log(field.name, types)
  return (
    <>
      <div className="flex py-2px items-center">
        {field.args.length || types.isObject || types.isNonNull ? (
          expanded ? (
            <ExpandedIcon className="flex-shrink-0" onClick={() => setExpanded(false)} />
          ) : (
            <ExpandIcon className="flex-shrink-0" onClick={() => setExpanded(true)} />
          )
        ) : (
          <UnselectedCheckbox className="flex-shrink-0" style={checkboxStyle} />
        )}
        <span className="text-[#1f61a0]">{field.name}</span>
      </div>
      {expanded && (
        <div className="pl-4">
          {field.args.map(arg => (
            <ArgView arg={arg} key={arg.name} />
          ))}
          {generateNonNullViews(field.type)}
        </div>
      )}
    </>
  )
}

export default FieldView
