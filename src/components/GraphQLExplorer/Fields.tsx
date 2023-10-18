import type { GraphQLField, GraphQLFieldMap, OperationDefinitionNode } from 'graphql'
import { Kind } from 'graphql'
import { useEffect, useRef } from 'react'

import { useGraphQLExplorer } from './provider'
import SelectableRow from './SelectableRow'
import { generateQueryAstPath, getQueryAstFromStack, getTypeName } from './utils'

interface FieldsProps {
  fields: GraphQLFieldMap<any, any>
}

const Fields = ({ fields }: FieldsProps) => {
  const {
    autoScroll,
    fieldSort,
    operationDefs,
    graphqlObjectStack,
    setGraphQLObjectStack,
    updateGraphQLQuery
  } = useGraphQLExplorer()
  const containerRef = useRef<HTMLDivElement>(null)
  const a = getQueryAstFromStack(graphqlObjectStack, operationDefs)
  const selectedKeys =
    a?.selectionSet?.selections?.map(sel => sel.kind === Kind.FIELD && sel.name.value) ?? []
  const b = generateQueryAstPath(graphqlObjectStack)
  console.log(a, b)
  function onSelect(field: GraphQLField<any, any, any>, index: number) {
    let selections = [...operationDefs!.selectionSet.selections]
    // 取消选择
    if (index > -1) {
      selections.splice(index, 1)
    } else {
      selections.push({
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: field.name }
      })
    }
    // @ts-ignore
    const def: OperationDefinitionNode = {
      ...operationDefs,
      selectionSet: {
        ...operationDefs!.selectionSet!,
        selections
      }
    }
    updateGraphQLQuery(def)
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
        containerRef.current?.querySelector('.selectable-row.selected-row')?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [
    fields, autoScroll
  ])

  return (
    <div className="flex-1 overflow-y-auto" ref={containerRef}>
      {sortedFields.map(key => {
        const field = fields[key]
        return (
          <SelectableRow
            key={field.name}
            selected={selectedKeys.includes(field.name)}
            name={key}
            type={getTypeName(field.type)}
            onSelect={() => onSelect(field, selectedKeys.indexOf(field.name))}
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
