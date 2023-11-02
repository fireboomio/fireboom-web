import { LeftOutlined } from '@ant-design/icons'
import type { ArgumentNode, FieldNode, ObjectFieldNode, SelectionNode, VariableDefinitionNode } from 'graphql'
import { Kind } from 'graphql'

import { useGraphQLExplorer } from './provider'
import SelectableIcon from './SelectableIcon'
import { getQueryArgumentsFromStack, getQueryNodeFromStack, isVariableDefinitionUsed, useEnsureOperationBeforeClick } from './utils'

interface ArgumentTitleProps {
  title: string
  type?: string
  isArray?: boolean
  selected: boolean
}

const ArgumentTitle = ({ title, type, isArray }: ArgumentTitleProps) => {
  const {
    argumentStack,
    setArgumentStack,
    graphqlObjectStack,
    currentQueryNode,
    currentQueryArguments,
    operationDefs,
    updateGraphQLQuery
  } = useGraphQLExplorer()
  const ensureOperation = useEnsureOperationBeforeClick()
  const currentInput = argumentStack[argumentStack.length - 1]

  function navigateBack() {
      const clone = argumentStack.slice()
      clone.pop()
      setArgumentStack(clone)
  }

  function onSelect(selected: boolean) {
    if (!selected) {
      if (argumentStack.length === 1) {
        const args = (currentQueryNode as FieldNode).arguments! as ArgumentNode[]
        const index = args.findIndex(arg => arg.name.value === currentInput.name)
        if (index > -1) {
          args.splice(index, 1)
        }
      } else {
        // TODO
        // const prevArguments = getQueryArgumentsFromStack(argumentStack.slice(0, argumentStack.length -1), operationDefs) as (ObjectFieldNode | ArgumentNode)[]
        // console.log(prevArguments, )

      }
      const variableUsedIndex = isVariableDefinitionUsed(currentInput.name, operationDefs!)
      if (variableUsedIndex > -1) {
        (operationDefs!.variableDefinitions as VariableDefinitionNode[]).splice(variableUsedIndex, 1)
      }
      updateGraphQLQuery(operationDefs)
      // const prevIndex = prevArguments.findIndex(arg => arg.name.value === (currentQueryArguments as FieldNode).name.value)
      // if (prevIndex > -1) {
      //   prevArguments.splice(prevIndex, 1)
      // }
      // updateGraphQLQuery(operationDefs)
    } else {
      const def = ensureOperation({ objectStack: graphqlObjectStack, argumentStack })
      updateGraphQLQuery(def)
    }
  }

  return (
    <div className="flex items-center">
      <LeftOutlined className="h-6 mr-2" onClick={navigateBack} />
      <span className="font-bold break-all select-text">
        {title}
        {type && (
          <>
            :<span className="ml-1">{isArray ? `[${type}]` : type}</span>{' '}
          </>
        )}
      </span>
      <SelectableIcon className="ml-2" onChange={onSelect} checked={!!currentQueryArguments} />
    </div>
  )
}

export default ArgumentTitle
