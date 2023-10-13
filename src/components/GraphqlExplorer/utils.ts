import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInputType, GraphQLInterfaceType, GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLScalarType, GraphQLUnionType, isEnumType, isInputObjectType, isInterfaceType, isListType, isNonNullType, isUnionType } from "graphql";

function getSimpleTypeName(type: GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLInputObjectType
  | GraphQLEnumType): string {
    return type.name;
  }

function getListTypeName(type: GraphQLList<GraphQLInputType | GraphQLOutputType>): string {
  return `[${getTypeName(type.ofType)}]`
}

export function getTypeName(type: GraphQLInputType | GraphQLOutputType): string {
  if (isNonNullType(type)) {
    return getTypeName(type.ofType)
  } 
  if (isListType(type)) {
    return getListTypeName(type as GraphQLList<GraphQLInputType | GraphQLOutputType>)
  }    
  return getSimpleTypeName(type)
}
