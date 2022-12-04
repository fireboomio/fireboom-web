import type { GraphQLField, GraphQLOutputType, SelectionNode } from 'graphql'
import {
  isEnumType,
  isInputObjectType,
  isInputType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType
} from 'graphql'

import ResultField from './ResultField'
import { arraySort, convertMapToArray } from './utils'

interface TypeFactoryProps {
  // GraphQLScalarType
  // | GraphQLObjectType
  // | GraphQLInterfaceType
  // | GraphQLUnionType
  // | GraphQLEnumType
  // | GraphQLList<GraphQLOutputType>
  // | GraphQLNonNull<
  //     | GraphQLScalarType
  //     | GraphQLObjectType
  //     | GraphQLInterfaceType
  //     | GraphQLUnionType
  //     | GraphQLEnumType
  //     | GraphQLList<GraphQLOutputType>
  //   >;
  type: GraphQLOutputType
  selections?: SelectionNode[]
  ensureSelection?: () => void
}

const TypeFactory = ({ type, selections, ensureSelection }: TypeFactoryProps) => {
  if (isListType(type)) {
    if (isScalarType(type.ofType) || isEnumType(type.ofType)) {
      return null
    }
    return (
      <TypeFactory type={type.ofType} selections={selections} ensureSelection={ensureSelection} />
    )
  }
  // if (isInputObjectType(type)) {
  //   const fields = type.getFields()
  //   return (
  //     <>
  //       {(arraySort(convertMapToArray(fields))).map(field => (
  //         // <ResultField key={field.name} field={field} />
  //         '111'
  //       ))}
  //     </>
  //   )
  // }
  if (isObjectType(type)) {
    const fields = type.getFields()
    return (
      <>
        {(arraySort(convertMapToArray(fields)) as GraphQLField<any, any>[]).map(field => (
          <ResultField
            key={field.name}
            field={field}
            selections={selections}
            ensureSelection={ensureSelection}
          />
        ))}
      </>
    )
  }
  if (isNonNullType(type)) {
    return (
      <TypeFactory type={type.ofType} selections={selections} ensureSelection={ensureSelection} />
    )
  }
  return <></>
}

export default TypeFactory
