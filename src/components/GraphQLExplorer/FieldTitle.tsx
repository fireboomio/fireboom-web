import { LeftOutlined } from '@ant-design/icons'
import type { FieldNode } from 'graphql'
import { Kind } from 'graphql'

import { useGraphQLExplorer } from './provider'
import SelectableIcon from './SelectableIcon'
import { getQueryNodeFromStack, useEnsureOperationBeforeClick } from './utils'

interface FieldTitleProps {
  title: string
  type?: string
  isArray?: boolean
  selected: boolean
}

const FieldTitle = ({ title, type, isArray }: FieldTitleProps) => {
  const {
    graphqlObjectStack,
    currentQueryNode,
    setGraphQLObjectStack,
    operationDefs,
    updateGraphQLQuery
  } = useGraphQLExplorer()
  const ensureOperation = useEnsureOperationBeforeClick()

  function navigateBack() {
    const clone = graphqlObjectStack.slice()
    clone.pop()
    setGraphQLObjectStack(clone)
  }

  function onSelect(selected: boolean) {
    if (!selected) {
      // 取消选中，从上级stack中查找对应的selection并移除
      if (graphqlObjectStack.length === 1) {
        updateGraphQLQuery(null)
      } else {
        const doc = getQueryNodeFromStack(
          graphqlObjectStack.slice(0, graphqlObjectStack.length - 1),
          operationDefs
        )
        if (doc) {
          const index = doc.selectionSet?.selections.findIndex(
            sel => sel.kind === Kind.FIELD && sel.name.value === title
          )
          if (index !== undefined && index > -1) {
            ;(doc.selectionSet!.selections as FieldNode[]).splice(index, 1)
          }
          updateGraphQLQuery(operationDefs)
        }
      }
    } else {
      const def = ensureOperation({ objectStack: graphqlObjectStack })
      updateGraphQLQuery(def)
    }
  }

  return (
    <div className="flex items-center">
      <LeftOutlined className="h-6 mr-2" onClick={navigateBack} />
      <span className="font-bold break-all">
        {title}
        {type && (
          <>
            :<span className="ml-1">{isArray ? `[${type}]` : type}</span>{' '}
          </>
        )}
      </span>
      <SelectableIcon className="ml-2" onChange={onSelect} checked={!!currentQueryNode} />
    </div>
  )
}

export default FieldTitle
