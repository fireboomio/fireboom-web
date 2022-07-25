import {
  DefinitionNode,
  VariableDefinitionNode,
  OperationDefinitionNode,
  FieldDefinitionNode,
  ScalarTypeDefinitionNode,
  TypeNode,
  FieldNode,
  NameNode,
  ConstDirectiveNode,
  ConstArgumentNode,
  Kind,
} from 'graphql'

import { FieldType, TableSource } from '@/interfaces/apimanage'

const BASE_SCALAR = ['Int', 'FLoat', 'String', 'Boolean', 'ID']

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const parseArgs = (varDefs: VariableDefinitionNode[]) => {
  return varDefs.map((x) => ({
    key: x.variable.name.value,
    name: x.variable.name.value,
    pos: 'path',
    ...parseType(x.type),
    directives: parseDirective(x.directives),
  }))
}

export const parseDirective = (directives: readonly ConstDirectiveNode[] | undefined) => {
  if (!directives) return undefined
  return directives.map((x) => ({
    name: x.name.value,
    args: parseDirectiveArg(x.arguments),
  }))
}

const parseDirectiveArg = (argNode: readonly ConstArgumentNode[] | undefined) => {
  if (!argNode) return undefined
  if (argNode.length === 0) return undefined

  return argNode.map((x) => {
    let val
    switch (x.value.kind) {
      case Kind.INT:
      case Kind.FLOAT:
      case Kind.STRING:
      case Kind.ENUM:
        val = x.value.value
        break
      default:
        val = undefined
        break
    }
    return {
      name: x.name.value,
      value: val,
    }
  })
}

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
  const kind = inner(typeDef) as string
  const isScalar = allScalar.includes(kind)

  return { kind, isScalar, isRequired, isList }
}

export const parseQuery = (
  schema: DefinitionNode[],
  node: OperationDefinitionNode | FieldNode,
  type: string,
  lv = '0'
): TableSource[] | undefined => {
  if (lv === '0') {
    type = capitalize((node as OperationDefinitionNode).operation)
  }

  if (!node.selectionSet) return undefined

  const allScalar = schema
    .filter((x) => x.kind === 'ScalarTypeDefinition')
    .map((x) => (x as ScalarTypeDefinitionNode).name.value)
    .concat(BASE_SCALAR)

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
      children: parseQuery(schema, subNode, fieldType.kind, `${lv}-${idx}`),
    }
  })
}
