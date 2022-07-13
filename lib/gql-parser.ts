import {
  DefinitionNode,
  VariableDefinitionNode,
  OperationDefinitionNode,
  TypeNode,
  FieldNode,
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

const parseType = (schema: DefinitionNode[], field: FieldNode, path: string[]): string => {
  console.log(field)
  console.log(path)
  return 'bbb'
  // const fieldName = selection.name.value
  // // const allQuery = gqlSchemaDef.find((i) => i.name.value === 'Query')
  // let rv = ''
  // console.log('^^^^^^^^ parse root', selection)
  // const rootQuery = gqlSchemaDef
  //   .filter((i) => i.kind === 'ObjectTypeDefinition')
  //   .find((i) => i.name.value === 'Query')
  //   .fields.find((i) => i.name.value === fieldName)
  // console.log(rootQuery, 'rootQuery')
  // switch (rootQuery.type.kind) {
  //   case 'NamedType':
  //     rv = 'Object'
  //     break
  //   case 'ListType':
  //     rv = 'List'
  //     break
  //   default:
  //     break
  // }
  // console.log('$$$$$$$$ parseType end')
  // return rv
}

export const parseQuery = (
  schema: DefinitionNode[],
  node: OperationDefinitionNode | FieldNode,
  path: string[] = []
): TableSource[] | undefined => {
  if (!node.selectionSet) return undefined

  const subNodes = node.selectionSet.selections as FieldNode[]
  return subNodes.map((subNode) => {
    const newPath = path.concat(subNode.name.value)
    return {
      key: newPath.join('-'),
      fieldName: subNode.name.value,
      fieldType: parseType(schema, subNode, newPath),
      children: parseQuery(schema, subNode, newPath),
    }
  })
}
