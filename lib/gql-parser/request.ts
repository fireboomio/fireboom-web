import {
  DefinitionNode,
  OperationDefinitionNode,
  FieldDefinitionNode,
  ScalarTypeDefinitionNode,
  TypeNode,
  FieldNode,
  NameNode,
} from 'graphql'

import { FieldType, TableSource } from '@/interfaces/apimanage'

import { GQL_BASE_SCALAR } from '../common'
import { capitalize } from '../utils'

export const parseType = (typeDef: TypeNode, allScalar: string[] = []): FieldType => {
  let isRequired = false
  let isList = false

  const inner = (node: TypeNode, depth = 0): string | undefined => {
    switch (node.kind) {
      case 'NamedType':
        return node.name.value
      case 'ListType':
        if (depth === 0 || depth === 1) isList = true
        return inner(node.type, depth++)
      case 'NonNullType':
        if (depth === 0) isRequired = true
        return inner(node.type, depth++)
      default:
        break
    }
  }
  const type = inner(typeDef) as string
  const isScalar = allScalar.includes(type)

  return { type, isScalar, isRequired, isList }
}

// 解析 query, muatation 等
const parseGql = (
  schema: readonly DefinitionNode[],
  node: OperationDefinitionNode | FieldNode,
  type = '',
  lv = '0'
): TableSource[] | undefined => {
  if (lv === '0') {
    type = capitalize((node as OperationDefinitionNode).operation)
  }

  if (!node.selectionSet) return undefined

  const allScalar = schema
    .filter((x) => x.kind === 'ScalarTypeDefinition')
    .map((x) => (x as ScalarTypeDefinitionNode).name.value)
    .concat(GQL_BASE_SCALAR)

  const subNodes = node.selectionSet.selections as FieldNode[]
  return subNodes.map((subNode, idx) => {
    const fields = // @ts-ignore
      schema.find((x) => (x.name as NameNode).value === type).fields as FieldDefinitionNode[]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const field = fields.find((x) => x.name.value === subNode.name.value)!.type
    const fieldType = parseType(field, allScalar)

    return {
      key: `${lv}-${idx}`,
      fieldName: subNode.name.value,
      fieldType: fieldType,
      directiveNames: node.directives?.map((x) => x.name.value),
      children: parseGql(schema, subNode, fieldType.type, `${lv}-${idx}`),
    }
  })
}

export default parseGql
