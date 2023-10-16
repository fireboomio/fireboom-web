import type {
  DocumentNode,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLUnionType,
  OperationDefinitionNode,
  OperationTypeNode
} from 'graphql'
import { isListType, isNonNullType, Kind, parse } from 'graphql'

import type { GraphQLObject } from './provider'

function getSimpleTypeName(
  type:
    | GraphQLScalarType
    | GraphQLObjectType
    | GraphQLInterfaceType
    | GraphQLUnionType
    | GraphQLInputObjectType
    | GraphQLEnumType
): string {
  return type.name
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

/**
 * 解析查询文本
 */
export function parseQuery(text: string): DocumentNode | null {
  try {
    text = text.replace(/^#.*$/gm, '')
    if (!text.trim()) {
      return null
    }

    return parse(
      text, // Tell graphql to not bother track locations when parsing, we don't need
      // it and it's a tiny bit more expensive.
      {
        noLocation: true
      }
    )
  } catch (e) {
    // 兼容没有 Field 的情况
    const matched = text.match(/(query|mutation|subscription) \w*\s*{\s*}/)
    if (matched) {
      return {
        kind: Kind.DOCUMENT,
        definitions: [
          {
            kind: Kind.OPERATION_DEFINITION,
            operation: matched[1] as OperationTypeNode,
            selectionSet: {
              kind: Kind.SELECTION_SET,
              selections: []
            }
          }
        ]
      }
    }
    return null
  }
}

/**
 * 从历史堆栈中查询对应的查询结构体
 */
export function getQueryAstFromStack(stack: GraphQLObject[], def: OperationDefinitionNode | null) {
  //
}
