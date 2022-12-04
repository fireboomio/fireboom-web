import type { GraphQLArgument } from 'graphql'
import {
  GraphQLInputObjectType,
  isEnumType,
  isInputObjectType,
  isListType,
  isObjectType,
  isScalarType
} from 'graphql'
import { useState } from 'react'

import { ExpandedIcon, ExpandIcon, UnselectedCheckbox } from './icons'
import { checkboxStyle } from './utils'
import BaseView from './BaseView'
import { CommonViews, generateCommonViews } from './ViewFactory'

interface ArgViewProps {
  arg: GraphQLArgument
}

const ArgView = ({ arg }: ArgViewProps) => {
  console.log(isInputObjectType(arg), isInputObjectType(arg.type), arg.name)
  return (
    <>
      <BaseView
        color="purple"
        name={arg.name}
        selectable={isScalarType(arg.type) || (isListType(arg.type) && isEnumType(arg.type.ofType))}
        expandedChildren={<CommonViews obj={arg.type} />}
      />
    </>
  )
}

export default ArgView
