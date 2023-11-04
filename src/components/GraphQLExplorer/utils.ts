import { isField } from '@apollo/client/utilities'
import {
  ArgumentNode,
  ConstValueNode,
  DefinitionNode,
  DocumentNode,
  EnumValueNode,
  FieldNode,
  GraphQLArgument,
  GraphQLEnumType,
  GraphQLFieldMap,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNamedOutputType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLUnionType,
  isWrappingType,
  NameNode,
  ObjectFieldNode,
  ObjectValueNode,
  OperationDefinitionNode,
  OperationTypeNode,
  SelectionNode,
  SelectionSetNode,
  TypeNode,
  ValueNode,
  VariableDefinitionNode
} from 'graphql'
import {
  getNamedType,
  getNullableType,
  isEnumType,
  isInputObjectType,
  isInputType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  Kind,
  parse
} from 'graphql'

import type { GraphQLObject } from './provider'
import { useGraphQLExplorer } from './provider'

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

function getArgumentNamedType(type: GraphQLArgument | GraphQLScalarType<unknown, unknown> | GraphQLEnumType | GraphQLInputObjectType): string {
  if ('type' in type) {
    return getArgumentNamedType(unwrapInputType(type.type))
  }
  return type.name
}

function getArgumentDefaultValue(type: GraphQLArgument | GraphQLScalarType<unknown, unknown> | GraphQLEnumType | GraphQLInputObjectType): ConstValueNode | undefined {
  if (isNonNullType(type)) {
    return undefined
  }
  if ('type' in type) {
    return getArgumentDefaultValue(unwrapInputType(type.type))
  }
  if (isListType(type)) {
    return { kind: Kind.LIST, values: [] }
  }
  if (type.name === 'String') {
    return { kind: Kind.STRING, value: '' }
  }
  if (type.name === 'Boolean') {
    return { kind: Kind.BOOLEAN, value: true }
  }
  if (type.name === 'Float') {
    return { kind: Kind.FLOAT, value: '1.0' }
  }
  if (type.name === 'Int') {
    return { kind: Kind.INT, value: '10' }
  }
  if (type.name === 'Enum') {
    return { kind: Kind.ENUM, value: (type as GraphQLEnumType).getValues()[0].value }
  }
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

export function unwrapInputType(inputType: GraphQLInputType) {
  let unwrappedType = inputType

  while (isWrappingType(unwrappedType)) {
    unwrappedType = unwrappedType.ofType
  }

  return unwrappedType
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
    // 解决空结构体问题
    text = text.replace(/{\s*}/g, '{__typename}')
    return parse(
      text, // Tell graphql to not bother track locations when parsing, we don't need
      // it and it's a tiny bit more expensive.
      {
        noLocation: true
      }
    )
  } catch (e) {
    // 兼容没有 Field 的情况
    // const matched = text.match(/(query|mutation|subscription) \w*\s*{\s*}/)
    // if (matched) {
    //   return {
    //     kind: Kind.DOCUMENT,
    //     definitions: [
    //       {
    //         kind: Kind.OPERATION_DEFINITION,
    //         operation: matched[1] as OperationTypeNode,
    //         selectionSet: {
    //           kind: Kind.SELECTION_SET,
    //           selections: []
    //         }
    //       }
    //     ]
    //   }
    // }
    return null
  }
}

/**
 * Fireboom description 解析
 * <#datasource#>([^}]+)<#datasource#>
 * <#originName#>([^}]+)<#originName#>
 */
export function parseDescription(description: string): {
  description?: string
  datasource?: string
  originName?: string
  [key: string]: any
} {
  const objMap: Record<string, string> = {}
  const matched = description.matchAll(/<#(\w+)#>([^<]+)<#(\w+)#>/g)
  for (const peace of matched) {
    if (peace.length > 3) {
      objMap[peace[1]] = peace[2]
    }
  }
  const leftDesc = description
    .split(/<#\w+#>/)
    .pop()
    ?.trim()
  const { datasource, originame, ...obj } = objMap
  return {
    description: leftDesc,
    datasource,
    originName: originame,
    ...obj
  }
}

/**
 * 从 field stack 中获取当前可展示的 fields
 */
export function getCurrentFieldsFromStack(
  stack: GraphQLObject[]
): GraphQLNamedOutputType | GraphQLFieldMap<any, any> | null {
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
        // cur = cur
      }
      // TODO 追加更多类型支持
      // 找不到的话后续的也就不用找了
      if (!cur) {
        return null
      }
    }
  }
  return cur
}

/**
 * 从历史堆栈中查询对应的查询结构体
 */
export function getQueryNodeFromStack(stack: GraphQLObject[], def: OperationDefinitionNode | null) {
  let cur: OperationDefinitionNode | SelectionNode | undefined | null = def
  for (const item of stack) {
    if ('getFields' in item) {
      // operation type 要一致
      if (item.name.toLowerCase() === def?.operation) {
        continue
      } else {
        return null
      }
    }
    cur = cur?.selectionSet?.selections.find(
      sel => sel.kind === Kind.FIELD && sel.name.value === item.name
    )
    // 找不到的话后续的也就不用找了
    if (!cur || !isField(cur!)) {
      return null
    }
  }
  return cur
}

/**
 * 从 argument 堆栈中查询当前 query 中的参数
 */
export function getQueryArgumentsFromStack(
  stack: (GraphQLArgument | GraphQLInputType)[],
  queryNode: OperationDefinitionNode | SelectionNode | undefined | null
):
  | readonly (ObjectFieldNode | ArgumentNode)[]
  | Exclude<ValueNode, 'ListValueNode' | 'ObjectValueNode'>
  | null {
  if (!queryNode) {
    return null
  }
  if (queryNode.kind === Kind.OPERATION_DEFINITION) {
    return null
  }
  const field = queryNode as FieldNode
  if (!field.arguments?.length) {
    return null
  }
  let ret: readonly (ObjectFieldNode | ArgumentNode)[] = field.arguments
  for (const item of stack) {
    const value: ValueNode | undefined = ret!.find(arg => {
      if (arg.kind === Kind.OBJECT_FIELD) {
        return arg.name.value === item.name
      }
      return arg.name.value === item.name
    })?.value
    // 找不到的话后续的也就不用找了
    if (!value) {
      return null
    }
    if (value.kind === Kind.OBJECT) {
      ret = value.fields
    } else if (value.kind === Kind.LIST) {
      // TODO: 数组情况处理
    } else {
      return value
    }
  }
  return ret ?? null
}

function generateDocumentFromFieldStack(
  objectStack: GraphQLObject[],
  argumentStack: (GraphQLArgument | GraphQLInputType)[],
  operationDefs: OperationDefinitionNode | null,
  operationName?: string
): OperationDefinitionNode | null {
  if (!objectStack.length) {
    return null
  }
  let doc: DocumentNode = {
    kind: Kind.DOCUMENT,
    definitions: operationDefs ? [operationDefs] : []
  }
  let prevSelections: FieldNode[] = []
  let selections: FieldNode[] = []
  for (const item of objectStack) {
    if ('getFields' in item) {
      selections = [{ kind: Kind.FIELD, name: generateEmptyName() }]
      if (!doc.definitions.length) {
        ; (doc.definitions as DefinitionNode[]).push({
          kind: Kind.OPERATION_DEFINITION,
          name: { kind: Kind.NAME, value: operationName ?? `my${item.name}` },
          operation: item.name.toLowerCase() as OperationTypeNode,
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections
          }
        })
      } else {
        selections = (doc.definitions[0]! as OperationDefinitionNode).selectionSet!
          .selections! as FieldNode[]
      }
    } else {
      const type = getNamedType(item.type)
      let _selections: FieldNode[] = isObjectType(type)
        ? [{ kind: Kind.FIELD, name: generateEmptyName() }]
        : []
      // remove __typename
      const __typename = selections.findIndex(sel => sel.name.value === '__typename')
      if (__typename > -1) {
        selections.splice(__typename, 1)
      }
      // remove empty value
      const empty = selections.findIndex(sel => sel.name.value === ' ')
      if (empty > -1) {
        selections.splice(empty, 1)
      }
      prevSelections = selections.slice()
      const found = selections.find(sel => sel.name.value === item.name)
      if (!found) {
        selections!.push({
          kind: Kind.FIELD,
          name: { kind: Kind.NAME, value: item.name },
          selectionSet: isScalarType(type)
            ? undefined
            : {
              kind: Kind.SELECTION_SET,
              selections: _selections
            }
        })
        prevSelections = selections.slice()
        selections = _selections
      } else {
        selections = (found.selectionSet?.selections as FieldNode[]) ?? []
      }
    }
  }
  if (argumentStack.length) {
    ; (prevSelections[0].arguments as ArgumentNode[]) = (prevSelections[0].arguments as ArgumentNode[]) || []
    const args = (prevSelections[0].arguments as ArgumentNode[])

    let valueNode = {} as ValueNode

    for (const [index, _arg] of argumentStack.entries()) {
      if (index === 0) {
        const arg = _arg as GraphQLArgument
        // 判断是否存在
        const existedNode = args?.find(_arg => _arg.name.value === arg.name)
        if (existedNode) {
          valueNode = existedNode.value
        } else {
          // 挂载新增根节点
          const rootArgument: ArgumentNode = {
            kind: Kind.ARGUMENT,
            name: { kind: Kind.NAME, value: arg.name },
            value: valueNode
          }
          args.push(rootArgument)
        }
      } else {
        // 后续子节点
        const arg = _arg as GraphQLInputType
        const type = getNamedType(arg)
        // 填补之前的 object 定义
        // 或 前一个节点已经是变量，此时销毁前一个节点定义，使用object覆盖
        if (!valueNode.kind || valueNode.kind === Kind.VARIABLE) {
          Object.assign(valueNode, {
            kind: Kind.OBJECT,
            fields: []
          })
          // @ts-ignore
          delete valueNode.name
        }
        if (valueNode.kind === Kind.OBJECT) {
          // 判断是否存在
          const existedField = valueNode.fields.find(field => field.name.value === type.name)
          if (existedField) {
            valueNode = existedField.value
          } else {
            const fields = valueNode.fields as ObjectFieldNode[]
            const baseValueNode = {} as ValueNode
            fields.push({
              kind: Kind.OBJECT_FIELD,
              name: { kind: Kind.NAME, value: type.name },
              value: isListType(arg) ? {
                kind: Kind.LIST,
                values: [baseValueNode]
              } : baseValueNode
            })
            valueNode = fields[fields.length - 1].value
          }
        }
      }
      // 最后一位
      if (index === argumentStack.length - 1) {
        const type = index === 0 ? (_arg as GraphQLArgument) : unwrapInputType(_arg as GraphQLInputType)
        const inputType = 'type' in type ? type.type : type
        const defs = doc.definitions[0] as Writeable<OperationDefinitionNode, 'variableDefinitions'>
        // 追加参数
        defs.variableDefinitions = defs.variableDefinitions ?? [];
        let typeNode: TypeNode = { kind: Kind.NAMED_TYPE, name: { kind: Kind.NAME, value: getArgumentNamedType(type) } }
        const isNonNull = isNonNullType(inputType)
        if (isListType(isNonNull ? inputType.ofType : inputType)) {
          typeNode = { kind: Kind.LIST_TYPE, type: typeNode }
        }
        if (isNonNull) {
          typeNode = { kind: Kind.NON_NULL_TYPE, type: typeNode }
        }
        // 防止重名
        const targetVariableName = getVariableName(type.name, operationDefs)
          ; (defs.variableDefinitions! as VariableDefinitionNode[])!.push({
            kind: Kind.VARIABLE_DEFINITION,
            type: typeNode,
            variable: { kind: Kind.VARIABLE, name: { kind: Kind.NAME, value: targetVariableName } },
            // directives: [],
            defaultValue: getArgumentDefaultValue(type)
          })
        Object.assign(valueNode, {
          kind: Kind.VARIABLE,
          name: { kind: Kind.NAME, value: targetVariableName }
        } as ValueNode)
      }
    }


    // 查找 prev selections 上是否有同名 rootArgument
    // 标记是否包含
    // let containRootArgument = false
    // let rootArgument: ArgumentNode | undefined = args?.find(_arg => _arg.name.value === (argumentStack[0] as GraphQLArgument).name)
    // if (rootArgument) {
    //   containRootArgument = true
    //   valueNode = rootArgument.value
    // }
    // if (!rootArgument) {
    //   rootArgument = {
    //     kind: Kind.ARGUMENT,
    //     name: { kind: Kind.NAME, value: (argumentStack[0] as GraphQLArgument).name },
    //     value: valueNode
    //   }
    // }
    // let argField: ObjectFieldNode | null = null
    // for (const [index, arg] of argumentStack.entries()) {
    //   const isFirst = index === 0
    //   const isLast = index === argumentStack.length - 1
    //   // 最后一个参数栈上的认为是 operation 参数
    //   if (isLast) {
    //     const type = isFirst ? (arg as GraphQLArgument) : unwrapInputType(arg as GraphQLInputType)
    //     const inputType = 'type' in type ? type.type : type
    //     // const inputType = 'type' in type ? unwrapInputType(type.type) : type
    //     const defs = doc.definitions[0] as Writeable<OperationDefinitionNode, 'variableDefinitions'>
    //     // 追加参数
    //     defs.variableDefinitions = defs.variableDefinitions ?? [];
    //     let typeNode: TypeNode = { kind: Kind.NAMED_TYPE, name: { kind: Kind.NAME, value: getArgumentNamedType(type) } }
    //     const isNonNull = isNonNullType(inputType)
    //     if (isListType(isNonNull ? inputType.ofType : inputType)) {
    //       typeNode = { kind: Kind.LIST_TYPE, type: typeNode }
    //     }
    //     if (isNonNull) {
    //       typeNode = { kind: Kind.NON_NULL_TYPE, type: typeNode }
    //     }
    //     // 防止重名
    //     const targetVariableName = getVariableName(type.name, operationDefs)
    //       ; (defs.variableDefinitions! as VariableDefinitionNode[])!.push({
    //         kind: Kind.VARIABLE_DEFINITION,
    //         type: typeNode,
    //         variable: { kind: Kind.VARIABLE, name: { kind: Kind.NAME, value: targetVariableName } },
    //         // directives: [],
    //         defaultValue: getArgumentDefaultValue(type)
    //       })
    //     if (argField) {
    //       Object.assign(argField, {
    //         name: { kind: Kind.NAME, value: type.name },
    //         value: {
    //           kind: Kind.VARIABLE,
    //           name: { kind: Kind.NAME, value: targetVariableName }
    //         }
    //       } as ObjectFieldNode)
    //       argField = null
    //     } else {
    //       Object.assign(valueNode, {
    //         kind: Kind.VARIABLE,
    //         name: { kind: Kind.NAME, value: type.name }
    //       } as ValueNode)
    //     }
    //   } else {
    //     const argument = arg as GraphQLInputType
    //     const type = getNamedType(argument)
    //     if (argField) {
    //       // @ts-ignore
    //       const _argField: ObjectFieldNode = {
    //         kind: Kind.OBJECT_FIELD,
    //       }
    //       const baseValueNode: ValueNode = {
    //         kind: Kind.OBJECT,
    //         fields: [_argField]
    //       }
    //       Object.assign(argField, {
    //         kind: Kind.OBJECT_FIELD,
    //         name: { kind: Kind.NAME, value: type.name },
    //         value: isListType(argument) ? {
    //           kind: Kind.LIST_TYPE,
    //           values: [baseValueNode]
    //         } : baseValueNode
    //       } as ObjectFieldNode)
    //       argField = _argField
    //     } else {
    //       const fields = (valueNode as ObjectValueNode).fields ?? []
    //       // 是否存在，存在只需引用
    //       argField = fields.find(field => field.name.value === type.name) ?? null
    //       if (!argField) {
    //         // @ts-ignore
    //         argField = {
    //           kind: Kind.OBJECT_FIELD,
    //         }
    //         // 合并 fields
    //         Object.assign(valueNode, {
    //           kind: Kind.OBJECT,
    //           fields: fields.length ? [...fields, argField] : [argField]
    //         } as ObjectValueNode)
    //       }
    //     }
    //   }
    // }
    // if (!containRootArgument) {
    //   if (args && args.length) {
    //     args.push(rootArgument!)
    //   } else {
    //     (prevSelections[0].arguments as ArgumentNode[]) = [rootArgument!]
    //   }
    // }
  }
  return doc.definitions[0] as OperationDefinitionNode
}

/**
 * 点击选择之前先确保 operation type 是一致的，fb 不支持一个 operation 里存在多个 operation type
 */
export function useEnsureOperationBeforeClick(): (args?: {
  objectStack?: GraphQLObject[]
  argumentStack?: (GraphQLArgument | GraphQLInputType)[]
}) => OperationDefinitionNode | null {
  const { graphqlObjectStack, argumentStack, operationDefs, operationName } = useGraphQLExplorer()

  return (args?: {
    objectStack?: GraphQLObject[]
    argumentStack?: (GraphQLArgument | GraphQLInputType)[]
  }) => {
    const _fieldStack = args?.objectStack ?? graphqlObjectStack
    const _argStack = args?.argumentStack ?? argumentStack
    if (_fieldStack.length) {
      // operation type 不同
      if (
        operationDefs?.operation !==
        (_fieldStack[0] as GraphQLObjectType<any, any>).name.toLowerCase()
      ) {
        return generateDocumentFromFieldStack(_fieldStack, _argStack, null, operationName)
      } else {
        return generateDocumentFromFieldStack(_fieldStack, _argStack, operationDefs, operationName)
      }
    }
    return null
  }
}

/**
 * 生成变量名，避免重复
 */
function getVariableName(varName: string, operationDefs: OperationDefinitionNode | null) {
  // 为空直接跳过
  if (!operationDefs || !operationDefs.variableDefinitions?.length) {
    return varName
  }
  const existedNames = operationDefs.variableDefinitions.map(varDef => varDef.variable.name.value)
  let suffix = 0
  while (existedNames.includes(`${varName}${suffix || ''}`)) {
    suffix++
  }
  return `${varName}${suffix || ''}`
}

/** 生成空节点 */
export function generateEmptyName(): NameNode {
  return { kind: Kind.NAME, value: ' ' }
}

/**
 * 构造一个空的 field 查询对象
 */
export function generateEmptyObjectField(): SelectionSetNode {
  return {
    kind: Kind.SELECTION_SET,
    selections: [
      {
        kind: Kind.FIELD,
        name: generateEmptyName()
      }
    ]
  }
}

/**
 * 变量在定义中是否被使用
 * 后续改为 operation 中所有参数定义自检
 */
export function isVariableDefinitionUsed(variableName: string, def: OperationDefinitionNode): number {
  if (def.variableDefinitions?.length) {
    return def.variableDefinitions.findIndex(def => def.variable.name.value === variableName)
  }
  return -1
}

export function removeUnusedVariablesInDefs(def: OperationDefinitionNode) {
  const variables: string[] = []
  function loopArguments(args: readonly (ArgumentNode | ValueNode)[]) {
    for (const _arg of args) {
      const arg = _arg.kind === Kind.ARGUMENT ? _arg.value : _arg
      if (arg.kind === Kind.VARIABLE) {
        variables.push(arg.name.value)
      } else if (arg.kind === Kind.LIST) {
        loopArguments(arg.values)
      } else if (arg.kind === Kind.OBJECT) {
        loopArguments(arg.fields.map(f => f.value))
      }
    }
  }
  function loopSelections(selections: readonly SelectionNode[]) {
    for (const selection of selections) {
      if (selection.kind === Kind.FIELD) {
        if (selection.arguments) {
          loopArguments(selection.arguments)
        }
        if (selection.selectionSet?.selections) {
          loopSelections(selection.selectionSet!.selections)
        }
      }
    }
  }
  loopSelections(def.selectionSet.selections)

  const defs = def.variableDefinitions as VariableDefinitionNode[]
  for (let i = defs.length - 1; i >= 0; i--) {
    if (!variables.includes(defs[i].variable.name.value)) {
      defs.splice(i, 1)
    }
  }
}

/**
 * 移除 field 上无意义的参数
 */
export function removeUnnecessaryArgumentInField(fieldNode: FieldNode) {
  const args = fieldNode.arguments! as ArgumentNode[]
  function isUsedValueNode(node: ValueNode) {
    if (!node) {
      return false
    }
    if (node.kind === Kind.LIST) {
      return !!node.values.length
    }
    if (node.kind === Kind.OBJECT) {
      const ret = node.fields.some(loop)
      if (!ret) {
        (node.fields as ObjectFieldNode[]) = []
      }
      return ret
    }
    if (node.kind === Kind.VARIABLE) {
      return !!node.name.value
    }
    return node.kind !== Kind.NULL
  }
  function loop(arg: ArgumentNode | ObjectFieldNode): boolean {
    if (arg.kind === Kind.ARGUMENT) {
      if (arg.value.kind === Kind.OBJECT) {
        const ret = arg.value.fields.some(loop)
        if (!ret) {
          (arg.value.fields as ObjectFieldNode[]) = []
        }
        return ret
      }
      return isUsedValueNode(arg.value)
    } else if (arg.kind === Kind.OBJECT_FIELD) {
      return isUsedValueNode(arg.value)
    }
    return isUsedValueNode(arg)
  }
  for (const arg of args) {
    if (!loop(arg)) {
      args.splice(args.indexOf(arg), 1)
    }
  }
}

export type Writeable<T extends Record<string, any>, K extends string> = {
  [P in K]: T[P]
}
