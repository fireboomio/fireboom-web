import { VariableDefinitionNode, ConstDirectiveNode, ConstArgumentNode, Kind } from 'graphql'

import { isEmpty } from '../utils'
import { parseType } from './request'

export const parseVariables = (varDefs: VariableDefinitionNode[]) => {
  return varDefs.map((x) => ({
    key: x.variable.name.value,
    name: x.variable.name.value,
    pos: 'path',
    ...parseType(x.type),
    directives: parseDirective(x.directives),
  }))
}

const parseDirective = (directives: readonly ConstDirectiveNode[] | undefined) => {
  if (!directives) return undefined
  return directives.map((x) => ({
    name: x.name.value,
    args: parseArgument(x.arguments),
  }))
}

const parseArgument = (argNodes: readonly ConstArgumentNode[] | undefined) => {
  if (isEmpty(argNodes)) return undefined

  // @ts-ignore
  return argNodes.map((x) => {
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
