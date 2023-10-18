import { isField } from '@apollo/client/utilities'
import {
  DocumentNode,
  GraphQLEnumType,
  GraphQLFieldMap,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLUnionType,
  OperationDefinitionNode,
  OperationTypeNode,
  SelectionNode,
  getNamedType,
  getNullableType,
  GraphQLNamedOutputType,
  isScalarType,
  GraphQLArgument,
  isObjectType,
  FieldNode
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
 * 根据stack生成查询ast路径
 */
export function generateQueryAstPath(stack: GraphQLObject[]) {
  const arr: (string | ((node: SelectionNode) => boolean))[] = []
  for (const item of stack) {
    if ('getFields' in item) {
      //
    } else {
      arr.push(
        'selectionSet',
        'selections',
        (node: SelectionNode) => node.kind === Kind.FIELD && node.name.value === item.name
      )
    }
  }
  return arr
}

/**
 * 从历史堆栈中查询对应的查询结构体
 */
export function getQueryAstFromStack(stack: GraphQLObject[], def: OperationDefinitionNode | null) {
  let cur: OperationDefinitionNode | SelectionNode | undefined | null = def
  for (const item of stack) {
    if ('getFields' in item) {
      continue
    }
    cur = cur?.selectionSet?.selections.find(
      sel => sel.kind === Kind.FIELD && sel.name.value === item.name
    )
    if (!cur || !isField(cur!)) {
      return null
    }
  }
  return cur
}

export function getSelectionNodesString(stack: GraphQLObject[], def: OperationDefinitionNode | null): string[] | null {
  let cur: OperationDefinitionNode | SelectionNode | undefined | null = def
  for (const item of stack) {
    if ('getFields' in item) {
      continue
    }
    cur = cur?.selectionSet?.selections.find(
      sel => sel.kind === Kind.FIELD && sel.name.value === item.name
    )
    if (!cur || !isField(cur!)) {
      return null
    }
  }
  return cur?.selectionSet?.selections.map(sel => (sel as FieldNode).name.value) ?? null
}

export function getCurrentFieldsFromStack(stack: GraphQLObject[]): GraphQLNamedOutputType | GraphQLFieldMap<any, any> | null {
  let cur: GraphQLFieldMap<any, any> | GraphQLNamedOutputType | null = null
  for (const item of stack) {
    if ('getFields' in item) {
      cur = item.getFields()
    } else {
      const type: GraphQLOutputType = (cur! as GraphQLFieldMap<any, any>)[item.name].type
      cur = getNamedType(type)
      console.log(getNullableType(type))
      if (isObjectType(cur)) {
        cur = cur.getFields()
      } else if (isScalarType(cur)) {
        cur = cur
      }
      // TODO 追加更多类型支持
    }
  }
  return cur
}
