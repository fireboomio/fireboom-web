import type {
  FieldNode,
  GraphQLField,
  GraphQLFieldMap,
  OperationDefinitionNode
} from 'graphql'
import { Kind } from 'graphql'
import { useEffect, useMemo, useRef } from 'react'

import { useGraphQLExplorer } from './provider'
import SelectableRow from './SelectableRow'
import { getTypeName, useEnsureOperationBeforeClick } from './utils'

interface FieldsProps {
  fields: GraphQLFieldMap<any, any>
}

const Fields = ({ fields }: FieldsProps) => {
  const {
    autoScroll,
    fieldSort,
    operationDefs,
    graphqlObjectStack,
    currentQueryNode,
    setGraphQLObjectStack,
    updateGraphQLQuery
  } = useGraphQLExplorer()
  const ensureOperation = useEnsureOperationBeforeClick()
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedKeys = useMemo(() => {
    if (currentQueryNode) {
      if (currentQueryNode.kind === Kind.OPERATION_DEFINITION) {
        return currentQueryNode.selectionSet.selections.map(
          sel => sel.kind === Kind.FIELD && sel.name.value
        )
      } else {
        return currentQueryNode.kind === Kind.FIELD
          ? currentQueryNode.selectionSet?.selections.map(
              sel => sel.kind === Kind.FIELD && sel.name.value
            )
          : []
      }
    }
  }, [currentQueryNode])

  function onSelect(field: GraphQLField<any, any, any>, index: number) {
    if (index > -1) {
      const set = (currentQueryNode as OperationDefinitionNode | FieldNode)!.selectionSet!
      ;(set.selections as FieldNode[]).splice(
        set.selections.findIndex(sel => sel.kind === Kind.FIELD && sel.name.value === field.name),
        1
      )
      updateGraphQLQuery(operationDefs)
    } else {
      const def = ensureOperation({
        objectStack: [...graphqlObjectStack, field]
      })
      updateGraphQLQuery(def)
    }
  }

  const sortedFields =
    fieldSort === 'asc'
      ? Object.keys(fields).sort().reverse()
      : fieldSort === 'desc'
      ? Object.keys(fields).sort()
      : Object.keys(fields)

  useEffect(() => {
    // 自动滚动到第一个选中的字段
    if (autoScroll) {
      requestIdleCallback(() => {
        containerRef.current
          ?.querySelector('.selectable-row.selected-row')
          ?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [fields, autoScroll])

  return (
    <div className="flex-1 overflow-y-auto" ref={containerRef}>
      {sortedFields.map(key => {
        const field = fields[key]
        return (
          <SelectableRow
            key={field.name}
            selected={selectedKeys?.includes(field.name)}
            name={key}
            typeName={getTypeName(field.type)}
            onSelect={() => onSelect(field, selectedKeys?.indexOf(field.name) ?? -1)}
            onClick={() => {
              setGraphQLObjectStack([...graphqlObjectStack, field])
            }}
          />
        )
      })}
    </div>
  )
}

export default Fields
