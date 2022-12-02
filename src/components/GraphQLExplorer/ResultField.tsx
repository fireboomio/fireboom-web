import type {
  ArgumentNode,
  GraphQLArgument,
  GraphQLField,
  OperationDefinitionNode,
  SelectionNode
} from 'graphql'
import {
  isEnumType,
  isInputObjectType,
  isInputType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  Kind,
  OperationTypeNode
} from 'graphql'
import { useCallback, useMemo } from 'react'

import ArgumentView from './ArgumentView'
import BaseView from './BaseView'
import { useExplorer } from './context'
import TypeFactory from './TypeFactory'
import { arraySort } from './utils'

interface ResultFieldProps {
  field: GraphQLField<any, any>
  selections?: SelectionNode[]
  ensureSelection?: () => void
}

const DEFAULT_QUERY_NAME = {
  [OperationTypeNode.QUERY]: `MyQuery`,
  [OperationTypeNode.MUTATION]: `MyMutation`,
  [OperationTypeNode.SUBSCRIPTION]: `MySubscription`
}

const findSelectionIndex = (
  selections: SelectionNode[] | undefined,
  field: GraphQLField<any, any>
) => {
  return selections
    ? selections.findIndex(sel => sel.kind === Kind.FIELD && sel.name.value === field.name)
    : -1
}

/**
 * 蓝色项
 */
const ResultField = ({ field, selections, ensureSelection }: ResultFieldProps) => {
  // console.log(field.name, 'isListType', isListType(field.type),
  //   'inInputList', isListType(field.type) ? (isScalarType(field.type.ofType) || isEnumType(field.type.ofType)): '',
  //   'isEnumType', isEnumType(field.type),
  //   'isNonNullType', isNonNullType(field.type),
  //   'isInputType', isInputType(field.type),
  //   'isInputObjectType', isInputObjectType(field.type),
  //   'isObjectType', isObjectType(field.type)
  // )
  const { queryAST, updateAST, fieldTypeMap } = useExplorer()
  const args = useMemo(() => {
    if (field.args) {
      return arraySort(field.args as GraphQLArgument[])
    }
    return []
  }, [field])

  const selectable = useMemo(() => {
    // 基本类型
    return (
      isScalarType(field.type) ||
      // 枚举
      isEnumType(field.type) ||
      // 输入类型
      isInputType(field.type) ||
      // 子类型是基本类型或枚举
      (isListType(field.type) && (isScalarType(field.type.ofType) || isEnumType(field.type.ofType)))
    )
  }, [field.type])

  const currentSelection = useMemo(() => {
    const index = findSelectionIndex(selections, field)
    return index > -1 ? selections![index] : undefined
  }, [selections, field])

  const _ensureSelection = useCallback(() => {
    const sel = ensureSelection?.()
    if (!currentSelection) {
      const _selections = selections ?? sel
      _selections!.push({
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: field.name },
        arguments: [],
        directives: [],
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: []
        }
      })
      // 如果没有设置query type 和 query name
      const def = queryAST.definitions[0] as OperationDefinitionNode
      if (!def.operation) {
        // @ts-ignore
        def.operation = fieldTypeMap[field.name]
      }
      if (!def.name!.value) {
        // @ts-ignore
        def.name!.value = DEFAULT_QUERY_NAME[def.operation!]
      } else if (
        Object.values(DEFAULT_QUERY_NAME).includes(def.name!.value) &&
        def.name!.value !== DEFAULT_QUERY_NAME[def.operation!]
      ) {
        // @ts-ignore
        def.name!.value = DEFAULT_QUERY_NAME[def.operation!]
      }
      return _selections
    } else {
      if (currentSelection.kind === Kind.FIELD && !currentSelection.selectionSet) {
        currentSelection.selectionSet = { kind: Kind.SELECTION_SET, selections: [] }
        return currentSelection.selectionSet?.selections
      }
    }
  }, [
    ensureSelection,
    currentSelection,
    selections,
    field.name,
    queryAST.definitions,
    fieldTypeMap
  ])

  const onClick = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        _ensureSelection()
        updateAST()
      } else {
        const index = selections
          ? selections.findIndex(sel => sel.kind === Kind.FIELD && sel.name.value === field.name)
          : -1
        if (index > -1) {
          selections!.splice(index, 1)
          updateAST()
        }
      }
    },
    [_ensureSelection, updateAST, selections, field.name]
  )

  const onCheck = useCallback(() => {
    const index = findSelectionIndex(selections, field)
    if (index > -1) {
      selections!.splice(index, 1)
    } else {
      _ensureSelection()
    }
    updateAST()
  }, [selections, field, updateAST, _ensureSelection])

  return (
    <BaseView
      isArg={false}
      name={field.name}
      selectable={selectable}
      defaultExpanded={!!currentSelection}
      checked={!!currentSelection}
      onClick={onClick}
      onCheck={onCheck}
    >
      {args.map(arg => (
        <ArgumentView
          selections={
            currentSelection?.kind === Kind.FIELD
              ? (currentSelection.arguments as ArgumentNode[])
              : undefined
          }
          arg={arg}
          key={arg.name}
          ensureSelection={_ensureSelection}
        />
      ))}
      <TypeFactory
        type={field.type}
        selections={
          currentSelection && currentSelection.kind === Kind.FIELD
            ? currentSelection.selectionSet?.selections
            : undefined
        }
        ensureSelection={_ensureSelection}
      />
    </BaseView>
  )
}

export default ResultField
