import type {
  ConstArgumentNode,
  ConstDirectiveNode,
  DirectiveNode,
  VariableDefinitionNode
} from 'graphql'
import { Kind } from 'graphql'

import type { ArgumentT, ParameterT } from '@/interfaces/apimanage'

import { isEmpty } from '../utils'
import { parseType } from './request'

export const parseRbac = (directives: readonly DirectiveNode[] | undefined) => {
  const dirs = parseDirective(directives as readonly ConstDirectiveNode[])
  const dir = dirs?.find(x => x.name === 'rbac')
  return dir?.args.map(x => ({ key: x.name, value: x.value })).at(0)
}

// 从 variableDefinition 字段解析参数
export const parseParameters = (
  varDefs: readonly VariableDefinitionNode[] | undefined
): ParameterT[] => {
  if (!varDefs) return []

  return varDefs.map((x: VariableDefinitionNode) => {
    const { type, isRequired, isList } = parseType(x.type)

    const directives = parseDirective(x.directives)

    return {
      key: x.variable.name.value,
      name: x.variable.name.value,
      position: 'path',
      type: type,
      isList,
      isRequired: directives?.some(dir => dir.name === 'internal') ? false : isRequired,
      directives
    }
  })
}

const parseDirective = (directives: readonly ConstDirectiveNode[] | undefined) => {
  if (!directives) return undefined

  return directives.map(x => {
    const args = parseArgument(x.arguments)

    return {
      name: x.name.value,
      args: args,
      payload: args.map(x => x.rendered)
    }
  })
}

const parseArgument = (argNodes: readonly ConstArgumentNode[] | undefined): ArgumentT[] => {
  if (isEmpty(argNodes)) return []

  // @ts-ignore
  return argNodes.map(x => {
    let val
    switch (x.value.kind) {
      case Kind.INT:
      case Kind.FLOAT:
      case Kind.STRING:
      case Kind.ENUM:
        val = x.value.value
        break
      case Kind.LIST:
        val = x.value.values.map(x => {
          if (x.kind === Kind.ENUM) return x.value
        })
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
      case Kind.LIST:
        rendered = `${x.value.values
          .map(x => {
            if (x.kind === Kind.ENUM) return x.value
          })
          .join(', ')}`
        break
      default:
        break
    }

    return {
      name: x.name.value,
      value: val,
      rendered: rendered
    }
  })
}
