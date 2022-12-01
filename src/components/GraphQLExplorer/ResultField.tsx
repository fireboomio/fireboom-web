import {
  ArgumentNode,
  GraphQLArgument,
  GraphQLField,
  isEnumType,
  isInputObjectType,
  isInputType,
  isListType,
  Kind,
  OperationDefinitionNode,
  OperationTypeNode,
  SelectionNode
} from 'graphql'
import { isNonNullType, isObjectType, isScalarType } from 'graphql'

import { arraySort } from './utils'
import BaseView from './BaseView'
import { useCallback, useMemo } from 'react'
import ArgumentView from './ArgumentView'
import TypeFactory from './TypeFactory'
import { useExplorer } from './context'

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
    return selections?.find(sel => sel.kind === Kind.FIELD && sel.name.value === field.name)
  }, [selections, field])

  const _ensureSelection = useCallback(() => {
    ensureSelection?.()
    if (!currentSelection) {
      selections!.push({
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: field.name },
        arguments: [],
        directives: [],
        selectionSet: undefined
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
    }
  }, [currentSelection, selections, queryAST])

  const onClick = useCallback((expanded: boolean) => {
    if (expanded) {
      _ensureSelection()
      updateAST()
    } else {
      const index = selections ? selections.findIndex(sel => sel.kind === Kind.FIELD && sel.name.value === field.name) : -1
      if (index > -1) {
        selections!.splice(index, 1)
        updateAST()
      }
    }
  }, [selections, updateAST, _ensureSelection])

  return (
    <BaseView color="blue" name={field.name} selectable={selectable} onClick={onClick}>
      {args.map(arg => (
        <ArgumentView
          selections={
            currentSelection?.kind === Kind.FIELD ? currentSelection.arguments as ArgumentNode[] : undefined
          }
          arg={arg}
          key={arg.name}
          ensureSelection={_ensureSelection}
        />
      ))}
      <TypeFactory type={field.type} />
    </BaseView>
  )
}

export default ResultField
