import { GraphQLEnumType, GraphQLInterfaceType, GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLScalarType, GraphQLUnionType, isEnumType, isInterfaceType, isListType, isNonNullType, isUnionType } from "graphql";

function getSimpleTypeName(type: GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType): string {
    return type.name;
  }

function getListTypeName(type: GraphQLList<GraphQLOutputType>): string {
  return `[${getTypeName(type.ofType)}]`
}

export function getTypeName(type: GraphQLOutputType): string {
  if (isNonNullType(type)) {
    return getTypeName(type.ofType)
  } 
    if (isListType(type)) {
      return getListTypeName(type)
    }
    
  return getSimpleTypeName(type)
}