import type {
  ArgumentNode,
  GraphQLArgument,
  GraphQLEnumType,
  GraphQLField,
  GraphQLList,
  GraphQLNullableType,
  ObjectFieldNode,
  ObjectValueNode,
  OperationDefinitionNode,
  ValueNode,
  VariableDefinitionNode
} from 'graphql'
import {
  GraphQLNonNull,
  isEnumType,
  isInputObjectType,
  isInputType,
  isListType,
  isNonNullType,
  isNullableType,
  isObjectType,
  isRequiredInputField,
  isScalarType,
  Kind
} from 'graphql'
import { useCallback, useMemo } from 'react'

import type { Writeable } from '@/interfaces/common'

import ArgumentValue from './ArgumentValue'
import BaseView from './BaseView'
import { useExplorer } from './context'
import { arraySort, convertMapToArray } from './utils'

interface ArgumentViewProps {
  arg: GraphQLArgument | GraphQLField<any, any>
  isObject?: boolean
  selections?: (ArgumentNode | ObjectFieldNode)[]
  ensureSelection: () => void
}

const findSelectionIndex = (
  selections: (ArgumentNode | ObjectFieldNode)[],
  arg: GraphQLArgument | GraphQLField<any, any>
) => {
  return selections.findIndex(
    sel =>
      (sel.kind === Kind.ARGUMENT && sel.name.value === arg.name) ||
      (sel.kind === Kind.OBJECT_FIELD && sel.name.value === arg.name)
  )
}

const ArgumentView = ({ arg, isObject, selections, ensureSelection }: ArgumentViewProps) => {
  console.log('arg', arg.name, isRequiredInputField(arg.type))
  // console.log(
  //   arg.name,
  //   'isListType',
  //   isListType(arg.type),
  //   'inInputList',
  //   isListType(arg.type) ? isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType) : '',
  //   'isEnumType',
  //   isEnumType(arg.type),
  //   'isNonNullType',
  //   isNonNullType(arg.type),
  //   'isInputType',
  //   isInputType(arg.type),
  //   'isInputObjectType',
  //   isInputObjectType(arg.type),
  //   'isObjectType',
  //   isObjectType(arg.type)
  // )
  const { queryAST, updateAST } = useExplorer()
  const selectable = useMemo(() => {
    return (
      // 基本类型
      isScalarType(arg.type) ||
      // 枚举
      isEnumType(arg.type) ||
      // 子类型是基本类型或枚举
      (isListType(arg.type) && (isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType))) ||
      // NonNull
      (isNonNullType(arg.type) &&
        (isScalarType(arg.type.ofType) ||
          isEnumType(arg.type.ofType) ||
          (isListType(arg.type.ofType) &&
            (isScalarType(arg.type.ofType.ofType) || isEnumType(arg.type.ofType.ofType)))))
    )
  }, [arg.type])

  const currentSelection = useMemo(() => {
    if (selections) {
      const index = findSelectionIndex(selections, arg)
      if (index > -1) {
        return selections[index]
      }
    }
  }, [selections, arg])

  // 当前是否是作为参数的
  const isAsArgument = useMemo(() => {
    const variables = (queryAST.definitions[0] as OperationDefinitionNode)
      .variableDefinitions! as VariableDefinitionNode[]
    const index = variables.findIndex(va => {
      // if (isInputObjectType(arg.type)) {
      //   return va.variable.name.value === arg.type.name
      // }
      return va.variable.name.value === arg.name
    })
    return index > -1
  }, [arg, queryAST])

  const getDefaultArgValue = useCallback<() => ValueNode>(() => {
    if (isScalarType(arg.type)) {
      switch (arg.type.name) {
        case 'Int':
          return { kind: Kind.INT, value: '10' }
        case 'String':
          return { kind: Kind.STRING, value: '' }
        case 'Boolean':
          return { kind: Kind.BOOLEAN, value: true }
      }
    } else if (isEnumType(arg.type)) {
      return { kind: Kind.ENUM, value: arg.type.getValues()[0].value }
    } else if (isListType(arg.type)) {
      if (isScalarType(arg.type.ofType)) {
        return {
          kind: Kind.ENUM,
          value:
            arg.type.ofType.name === 'String' ? '' : arg.type.ofType.name === 'Boolean' ? true : 10
        }
      }
      if (isEnumType(arg.type.ofType)) {
        return { kind: Kind.ENUM, value: arg.type.ofType.getValues()[0].value }
      }
      if (isInputType(arg.type)) {
        return { kind: Kind.OBJECT, fields: [] }
      }
      return { kind: Kind.LIST, values: [] }
    }
    return { kind: Kind.OBJECT, fields: [] }
  }, [arg])

  const _ensureSelection = useCallback(
    (val?: ValueNode) => {
      ensureSelection()
      if (!currentSelection) {
        selections!.push({
          kind: isObject ? Kind.OBJECT_FIELD : Kind.ARGUMENT,
          name: { kind: Kind.NAME, value: arg.name },
          value: val ?? getDefaultArgValue()
        })
      }
    },
    [ensureSelection, currentSelection, selections, isObject, arg.name, getDefaultArgValue]
  )

  const onClick = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        _ensureSelection()
        updateAST()
      } else {
        const index = selections ? findSelectionIndex(selections, arg) : -1
        if (index > -1) {
          selections!.splice(index, 1)
          updateAST()
        }
      }
    },
    [_ensureSelection, updateAST, selections, arg]
  )

  const onCheck = useCallback(() => {
    const index = selections ? findSelectionIndex(selections, arg) : -1
    if (index > -1) {
      selections!.splice(index, 1)
    } else {
      _ensureSelection()
    }
    updateAST()
  }, [selections, arg, updateAST, _ensureSelection])

  const onToggleAsArgument = useCallback(() => {
    const variables = (queryAST.definitions[0] as OperationDefinitionNode)
      .variableDefinitions! as VariableDefinitionNode[]
    const index = variables.findIndex(va => {
      if (isObjectType(arg.type)) {
        return va.variable.name.value === arg.type.name
      }
      return va.variable.name.value === arg.name
    })
    if (index > -1) {
      variables.splice(index, 1)
    } else {
      const va: Writeable<VariableDefinitionNode> = {
        kind: Kind.VARIABLE_DEFINITION,
        variable: {
          kind: Kind.VARIABLE,
          name: {
            kind: Kind.NAME,
            value: arg.name
          }
        },
        type: { kind: Kind.NAMED_TYPE, name: { kind: Kind.NAME, value: '' } }
        // TODO defaultValue
      }
      if (isScalarType(arg.type)) {
        va.type.name.value = arg.type.name
        va.defaultValue = getDefaultArgValue()
      } else if (isInputObjectType(arg.type)) {
        // @ts-ignore
        va.type.name.value = arg.type.name
        va.defaultValue = { kind: Kind.OBJECT, fields: [] }
      } else if (isListType(arg.type)) {
        if (isScalarType(arg.type.ofType)) {
          va.type.name.value = arg.type.ofType.name
        } else if (isEnumType(arg.type.ofType)) {
          va.type.name.value = `[${arg.type.ofType.name}]`
        }
      }
      // 强制修改当前参数
      ensureSelection()
      const value: ValueNode = {
        kind: Kind.VARIABLE,
        name: { kind: Kind.NAME, value: arg.name }
      }
      if (!currentSelection) {
        selections!.push({
          kind: isObject ? Kind.OBJECT_FIELD : Kind.ARGUMENT,
          name: { kind: Kind.NAME, value: arg.name },
          value
        })
      } else {
        currentSelection.value = value
      }
      variables.push(va)
    }
    updateAST()
  }, [
    queryAST.definitions,
    updateAST,
    arg.type,
    arg.name,
    ensureSelection,
    currentSelection,
    getDefaultArgValue,
    selections,
    isObject
  ])

  const onChangeValue = useCallback(
    (val: any) => {
      currentSelection!.value.value = val
      updateAST()
    },
    [currentSelection, updateAST]
  )

  const child = useMemo(() => {
    if (isListType(arg.type)) {
      if (isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType)) {
        return null
      }
      if (isInputType(arg.type)) {
        return (
          <TypedArgumentView
            type={arg.type.ofType}
            isObject
            // @ts-ignore
            selections={(currentSelection?.value as ObjectValueNode)?.fields}
            ensureSelection={_ensureSelection}
          />
        )
      }
    }
    if (isInputObjectType(arg.type)) {
      const fields = arg.type.getFields()
      return arraySort(convertMapToArray(fields)).map(field => (
        <ArgumentView
          key={field.name}
          arg={field}
          selections={currentSelection?.value.fields}
          ensureSelection={_ensureSelection}
        />
      ))
    }
    return null
  }, [_ensureSelection, arg.type, currentSelection?.value])

  return (
    <BaseView
      isArg
      argChecked={isAsArgument}
      name={isNonNullType(arg.type) ? `${arg.name}*` : arg.name}
      defaultExpanded={!!currentSelection}
      expandable={!isAsArgument}
      checked={!!currentSelection}
      selectable={selectable}
      valueNode={
        <ArgumentValue
          name={arg.name}
          isChecked={!!currentSelection}
          value={currentSelection?.value?.value}
          isArg={isAsArgument}
          onChange={onChangeValue}
          isInput={isScalarType(arg.type) && arg.type.name === 'String'}
          isEnum={isListType(arg.type) && isEnumType(arg.type.ofType)}
          enumValues={() =>
            (arg.type as GraphQLList<GraphQLEnumType>).ofType.getValues().map(item => ({
              label: item.name,
              value: item.value
            }))
          }
          isNumber={isScalarType(arg.type) && arg.type.name !== 'String'}
          isObject={isInputObjectType(arg.type)}
        />
      }
      onClick={onClick}
      onCheck={onCheck}
      onToggleAsArgument={onToggleAsArgument}
    >
      {child}
    </BaseView>
  )
}

export default ArgumentView

export const TypedArgumentView = ({
  type,
  isObject,
  selections,
  ensureSelection
}: {
  type: GraphQLNullableType
  isObject?: boolean
  selections?: ObjectFieldNode[]
  ensureSelection: () => void
}) => {
  if (isInputObjectType(type) || isObjectType(type)) {
    const fields = type.getFields()
    return (
      <>
        {(arraySort(convertMapToArray(fields)) as GraphQLField<any, any>[]).map(field => (
          <ArgumentView
            key={field.name}
            arg={field}
            isObject={isObject}
            selections={selections}
            ensureSelection={ensureSelection}
          />
        ))}
      </>
    )
  }
  return null
}
