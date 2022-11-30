import { GraphQLArgument, GraphQLField, GraphQLNonNull, GraphQLNullableType, isInputType, isNonNullType, isNullableType, isObjectType } from 'graphql'
import { isEnumType, isInputObjectType, isListType, isScalarType } from 'graphql'
import { useMemo } from 'react'
import BaseView from './BaseView'
import { arraySort, convertMapToArray } from './utils'

interface ArgumentViewProps {
  arg: GraphQLArgument | GraphQLField<any, any>
}

const ArgumentView = ({ arg }: ArgumentViewProps) => {
  // console.log(arg.name, 'isListType', isListType(arg.type),
  //   'inInputList', isListType(arg.type) ? (isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType)): '',
  //   'isEnumType', isEnumType(arg.type),
  //   'isNonNullType', isNonNullType(arg.type),
  //   'isInputType', isInputType(arg.type),
  //   'isInputObjectType', isInputObjectType(arg.type),
  //   'isObjectType', isObjectType(arg.type)
  // )
  const selectable = useMemo(() => {

    // 基本类型
    return isScalarType(arg.type)
     // 枚举
     || isEnumType(arg.type)
     // 子类型是基本类型或枚举
     || (isListType(arg.type) && (isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType)))
  }, [arg.type])

  const child = useMemo(() => {
    if (isListType(arg.type)) {
      if (isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType)) {
        return null
      }
      return <TypedArgumentView type={arg.type.ofType} />
    }
    if (isInputObjectType(arg.type)) {
      const fields = arg.type.getFields()
      return arraySort(convertMapToArray(fields)).map(field => <ArgumentView key={field.name} arg={field} />)
    }
    if (isObjectType(arg.type)) {
      // return <ArgumentView arg={arg.type.ofType} />
      return <TypedArgumentView type={arg.type } />
    }
    return null
  }, [arg.type])

  return (
    <BaseView
      color="purple"
      name={arg.name}
      selectable={selectable}
    >
      {child}
    </BaseView>
  )
}

export default ArgumentView

export const TypedArgumentView = ({ type }: { type: GraphQLNullableType }) => {
  if (isInputObjectType(type) || isObjectType(type)) {
    const fields = type.getFields()
    return (
      <>
        {(arraySort(convertMapToArray(fields)) as GraphQLField<any, any>[]).map(field => (
          <ArgumentView key={field.name} arg={field} />
        ))}
      </>
    )
  } 
  return null
}