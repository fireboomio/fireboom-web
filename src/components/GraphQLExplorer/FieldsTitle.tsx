import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { FieldNode, GraphQLFieldMap, isEnumType, OperationDefinitionNode, SelectionSetNode } from 'graphql'
import {
  getNamedType,
  isObjectType,
  isScalarType,
  Kind,
} from 'graphql'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import IconButton, { IconButtonMore } from './IconButton'
import { SortableOutlined } from './Icons'
import { useGraphQLExplorer } from './provider'
import type { SelectableIconProps } from './SelectableIcon'
import SelectableIcon from './SelectableIcon'
import type { Writeable } from './utils'
import {
  generateEmptyObjectField,
  getQueryNodeFromStack,
  useEnsureOperationBeforeClick
} from './utils'

const FieldsTitle = () => {
  const {
    currentFields,
    operationDefs,
    fieldSort,
    currentQueryNode,
    graphqlObjectStack,
    toggleFieldSort,
    updateGraphQLQuery
  } = useGraphQLExplorer()
  const ensureOperation = useEnsureOperationBeforeClick()

  const checked = useMemo<SelectableIconProps['checked']>(() => {
    if (!currentQueryNode) {
      return false
    }
    const selections = (currentQueryNode as FieldNode).selectionSet?.selections
    const contained = selections?.filter(
      sel => sel.kind === Kind.FIELD && (currentFields as GraphQLFieldMap<any, any>)[sel.name.value]
    )
    return contained?.length
      ? contained.length === Object.keys(currentFields || {}).length
        ? true
        : 'indeterminate'
      : false
  }, [currentFields, currentQueryNode])

  function onSelect(checked: boolean) {
    if (!checked) {
      if (currentQueryNode?.kind === Kind.OPERATION_DEFINITION) {
        ;(currentQueryNode as Writeable<OperationDefinitionNode, 'selectionSet'>).selectionSet =
          generateEmptyObjectField()
      } else {
        ;(currentQueryNode as Writeable<FieldNode, 'selectionSet'>).selectionSet =
          generateEmptyObjectField()
      }
      updateGraphQLQuery(operationDefs)
    } else {
      const def = ensureOperation({
        objectStack: graphqlObjectStack
      })
      const doc = getQueryNodeFromStack(graphqlObjectStack, def)
      if (doc) {
        ;(doc.selectionSet as SelectionSetNode) = doc.selectionSet || {
          kind: Kind.SELECTION_SET,
          selections: []
        }
        doc.selectionSet!.selections = Object.keys(
          currentFields as GraphQLFieldMap<any, any>
        ).map<FieldNode>(key => {
          const type = getNamedType((currentFields as GraphQLFieldMap<any, any>)[key].type)
          return {
            kind: Kind.FIELD,
            name: { kind: Kind.NAME, value: key },
            selectionSet: isObjectType(type) ? generateEmptyObjectField() : undefined
          }
        })
      }
      updateGraphQLQuery(def)
    }
  }

  function selectFieldMap(fields: GraphQLFieldMap<any, any>, level: number): FieldNode[] {
    return Object.keys(fields).reduce<FieldNode[]>((arr, key) => {
      if (key !== '_join') {
        const type = getNamedType(fields[key].type)
        if (isScalarType(type) || isEnumType(type)) {
          arr.push({
            kind: Kind.FIELD,
            name: { kind: Kind.NAME, value: key }
          })
        } else if (isObjectType(type)) {
          const fields = type.getFields()
          arr.push({
            kind: Kind.FIELD,
            name: { kind: Kind.NAME, value: key },
            selectionSet: level >= 5 ? generateEmptyObjectField() : {
              kind: Kind.SELECTION_SET,
              selections: selectFieldMap(fields, level+1)
            }
          })
        }
      }
      return arr
    }, [])
  }

  const onSelectMore = (index: number) => {
    const def = ensureOperation({
      objectStack: graphqlObjectStack
    })
    const doc = getQueryNodeFromStack(graphqlObjectStack, def)
    if (doc) {
      ;(doc.selectionSet as SelectionSetNode) = doc.selectionSet || {
        kind: Kind.SELECTION_SET,
        selections: []
      }
      const fields = currentFields as GraphQLFieldMap<any, any>
      // 选择所有标量
      if (index === 0) {
        doc.selectionSet!.selections = Object.keys(fields).reduce<FieldNode[]>((arr, key) => {
          const type = getNamedType(fields[key].type)
          if (isScalarType(type) || isEnumType(type)) {
            arr.push({
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: key }
            })
          }
          return arr
        }, [])
      } else {
        // 递归选择所有字段
        doc.selectionSet!.selections = selectFieldMap(currentFields, 1)
      }
    }
    updateGraphQLQuery(def)
  }

  return (
    <div className="mt-3 mb-2 flex items-center">
      <span className="font-semibold text-md">
        <FormattedMessage defaultMessage="字段列表" />
      </span>
      <IconButton className="ml-2" onClick={toggleFieldSort}>
        {fieldSort === 'asc' ? (
          <ArrowUpOutlined className="h-3" />
        ) : fieldSort === 'desc' ? (
          <ArrowDownOutlined className="h-3" />
        ) : (
          <SortableOutlined className="h-3" />
        )}
      </IconButton>
      <div className="ml-2 flex items-center">
        <SelectableIcon checked={checked} onChange={onSelect} />
        <IconButtonMore items={['选择所有标量字段', '递归选择所有字段']} onClick={onSelectMore} />
      </div>
    </div>
  )
}

export default FieldsTitle
