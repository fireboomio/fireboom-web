import { GraphQLArgument, GraphQLField, isEnumType, isInputObjectType, isInputType, isListType } from 'graphql'
import { isNonNullType, isObjectType, isScalarType } from 'graphql'

import { arraySort } from './utils'
import ArgView from './ArgView'
import BaseView from './BaseView'
import { CommonViews } from './ViewFactory'
import { useMemo } from 'react'
import ArgumentView from './ArgumentView'
import TypeFactory from './TypeFactory'

interface ResultFieldProps {
  field: GraphQLField<any, any>
}

/**
 * 蓝色项
 */
const ResultField = ({ field }: ResultFieldProps) => {
  console.log(field.name, 'isListType', isListType(field.type),
    'inInputList', isListType(field.type) ? (isScalarType(field.type.ofType) || isEnumType(field.type.ofType)): '',
    'isEnumType', isEnumType(field.type),
    'isNonNullType', isNonNullType(field.type),
    'isInputType', isInputType(field.type),
    'isInputObjectType', isInputObjectType(field.type),
    'isObjectType', isObjectType(field.type)
  )

  const args = useMemo(() => {
    if (field.args) {
      return arraySort(field.args as GraphQLArgument[])
    }
    return []
  }, [field])

  const selectable = useMemo(() => {

    // 基本类型
    return isScalarType(field.type)
     // 枚举
     || isEnumType(field.type)
     // 输入类型
     || isInputType(field.type)
     // 子类型是基本类型或枚举
     || (isListType(field.type) && (isScalarType(field.type.ofType) || isEnumType(field.type.ofType)))
  }, [field.type])

  return (
    <BaseView
      color="blue"
      name={field.name}
      selectable={selectable}
    >
      {args.map(arg => <ArgumentView arg={arg} key={arg.name} /> )}
      <TypeFactory type={field.type} />
    </BaseView>
  )
}

export default ResultField
