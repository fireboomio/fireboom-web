import {
  DefinitionNode,
  VariableDefinitionNode,
  OperationDefinitionNode,
  FieldDefinitionNode,
  TypeNode,
  FieldNode,
  NameNode,
} from 'graphql'

import { TableSource } from '@/interfaces/apimanage'

export const parseArgs = (varDefs: VariableDefinitionNode[]) => {
  return varDefs.map((x) => ({
    key: x.variable.name.value,
    name: x.variable.name.value,
    pos: 'path',
    ...getType(x.type),
  }))
}

export const getType = (typeDef: TypeNode) => {
  let required = false

  const inner = (node: TypeNode, depth = 0): string => {
    switch (node.kind) {
      case 'NamedType':
        return node.name.value
      case 'ListType':
        return inner(node.type, depth++)
      case 'NonNullType':
        if (depth === 0) required = true
        return inner(node.type, depth++)
    }
  }
  const kind = inner(typeDef)

  return {
    kind,
    required,
  }
}

const parseType = (
  schema: DefinitionNode[],
  field: FieldNode,
  initKind: string | undefined
): { kind: string; required: boolean } => {
  let rv
  if (!initKind) {
    const allFields = // @ts-ignore
      schema.find((i) => (i.name as NameNode).value === 'Query').fields as FieldDefinitionNode[]

    // @ts-ignore
    rv = getType(allFields.find((x) => x.name.value === field.name.value).type)
  } else {
    const fields = // @ts-ignore
      schema.find((x) => (x.name as NameNode).value === initKind).fields as FieldDefinitionNode[]

    // @ts-ignore
    rv = getType(fields.find((x) => x.name.value === field.name.value).type)
  }

  return rv
}

export const parseQuery = (
  schema: DefinitionNode[],
  node: OperationDefinitionNode | FieldNode,
  type: string | undefined = undefined,
  lv = '0'
): TableSource[] | undefined => {
  if (!node.selectionSet) return undefined

  const subNodes = node.selectionSet.selections as FieldNode[]
  return subNodes.map((subNode, idx) => {
    const { kind, required: _ } = parseType(schema, subNode, type)
    return {
      key: `${lv}-${idx}`,
      fieldName: subNode.name.value,
      fieldType: kind,
      children: parseQuery(schema, subNode, kind, `${lv}-${idx}`),
    }
  })
}
