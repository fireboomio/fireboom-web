import { VariableDefinitionNode, ConstDirectiveNode, ConstArgumentNode, Kind } from 'graphql'

import { ParameterT, ArgumentT } from '@/interfaces/apimanage'

import { isEmpty } from '../utils'
import { parseType } from './request'

// 从 variableDefinition 字段解析参数
export const parseParameters = (varDefs: VariableDefinitionNode[]): ParameterT[] => {
  return varDefs.map((x: VariableDefinitionNode) => {
    const { type, isRequired } = parseType(x.type)

    return {
      key: x.variable.name.value,
      name: x.variable.name.value,
      position: 'path',
      type: type,
      isRequired: isRequired,
      directives: parseDirective(x.directives),
    }
  })
}

const parseDirective = (directives: readonly ConstDirectiveNode[] | undefined) => {
  if (!directives) return undefined

  return directives.map((x) => {
    const args = parseArgument(x.arguments)

    return {
      name: x.name.value,
      args: args,
      payload: args.map((x) => x.rendered).join('\n'),
    }
  })
}

const parseArgument = (argNodes: readonly ConstArgumentNode[] | undefined): ArgumentT[] => {
  if (isEmpty(argNodes)) return []

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
        break
    }

    let rendered = ''
    switch (x.value.kind) {
      case Kind.STRING:
        rendered = `${x.name.value}: "${x.value.value}"`
        break
      case Kind.INT:
      case Kind.FLOAT:
      case Kind.ENUM:
        rendered = `${x.name.value}: ${x.value.value}`
        break
      default:
        break
    }

    return {
      name: x.name.value,
      value: val,
      rendered: rendered,
    }
  })
}
