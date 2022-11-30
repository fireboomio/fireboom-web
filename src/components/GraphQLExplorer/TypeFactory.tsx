import { GraphQLField, GraphQLOutputType, isEnumType, isInputObjectType, isInputType, isListType, isNonNullType, isObjectType, isScalarType } from 'graphql'
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
}

const TypeFactory = ({ type }: TypeFactoryProps) => {
  if (isListType(type)) {
    if (isScalarType(type.ofType) || isEnumType(type.ofType)) {
      return null
    }
    return <TypeFactory type={type.ofType} />
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
          <ResultField key={field.name} field={field} />
        ))}
      </>
    )
  }
  if (isNonNullType(type)) {
    return <TypeFactory type={type.ofType} />
  }
  return <></>
}

export default TypeFactory
