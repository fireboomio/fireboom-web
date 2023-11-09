import {
  ArgumentNode,
  FieldNode,
  GraphQLArgument,
  GraphQLInputField,
  GraphQLInputFieldMap,
  GraphQLInputType,
  isScalarType,
  Kind,
  ObjectFieldNode,
  ValueNode,
  VariableNode
} from 'graphql'
import { FormattedMessage } from 'react-intl'

import { useGraphQLExplorer } from './provider'
import { VariableSelectIcon } from './SelectableIcon'
import SelectableRow from './SelectableRow'
import { removeUnusedVariablesInDefs, getQueryArgumentsFromStack, getQueryNodeFromStack, getTypeName, isVariableDefinitionUsed, removeUnnecessaryArgumentInField, useEnsureOperationBeforeClick } from './utils'

interface ArgumentsProps {
  args: GraphQLInputFieldMap
}

const Arguments = ({ args }: ArgumentsProps) => {
  const {
    graphqlObjectStack,
    argumentStack,
    setArgumentStack,
    operationDefs,
    currentQueryNode,
    currentQueryArguments,
    updateGraphQLQuery
  } = useGraphQLExplorer()
  const ensureOperation = useEnsureOperationBeforeClick()

  const _args: ReadonlyArray<GraphQLArgument> | GraphQLInputType[] = Object.keys(args).map(
    key => (args as GraphQLInputFieldMap)[key]
  )

  function onSelect(arg: GraphQLArgument | GraphQLInputField, selected: boolean, index: number) {
    if (selected) {
      const valueNode = (currentQueryArguments as (ObjectFieldNode | ArgumentNode)[])[index].value
      let curArg: string
      if (valueNode.kind === Kind.LIST) {
        curArg = arg.name
      } else if (valueNode.kind === Kind.OBJECT) {
        curArg = arg.name
      } else {
        curArg = (valueNode as VariableNode).name.value
      }
      if (Array.isArray(currentQueryArguments)) {
        (currentQueryArguments as (ObjectFieldNode | ArgumentNode)[])!.splice(index, 1)
      } else {
        // 从上一层开始删除
        const prevArgs = getQueryArgumentsFromStack(argumentStack.slice(0, argumentStack.length - 1), currentQueryNode) as (ObjectFieldNode | ArgumentNode)[]
        prevArgs.splice(prevArgs.findIndex(_arg => _arg.name.value === arg.name), 1)
      }
      removeUnnecessaryArgumentInField(getQueryNodeFromStack(graphqlObjectStack, operationDefs)! as FieldNode)

      // 删除所有未使用的定义
      removeUnusedVariablesInDefs(operationDefs!)

      // // 如果删除后该变量未使用，则从变量定义中移除
      // const variableUsedIndex = isVariableDefinitionUsed(curArg, operationDefs!)
      // if (variableUsedIndex > -1) {
      //   (operationDefs!.variableDefinitions as VariableDefinitionNode[]).splice(variableUsedIndex, 1)
      // }
      updateGraphQLQuery(operationDefs)
    } else {
      const def = ensureOperation({ objectStack: graphqlObjectStack, argumentStack: [...argumentStack, arg] })
      updateGraphQLQuery(def)
    }
  }

  const onClick = (arg: GraphQLArgument | GraphQLInputType) => {
    setArgumentStack([...argumentStack, arg])
  }

  return (
    <>
      <div className="mt-4 mb-2 font-semibold text-md">
        <FormattedMessage defaultMessage="参数列表" />
      </div>
      {_args.map((arg) => {
        let selected = false
        let index: number
        if (Array.isArray(currentQueryArguments)) {
          index = (currentQueryArguments as (ObjectFieldNode | ArgumentNode)[])?.findIndex(
            a => a.name.value === arg.name
          )
          selected = index > -1
        } else if (currentQueryArguments) {
          const valueNode = currentQueryArguments as Exclude<ValueNode, 'ListValueNode' | 'ObjectValueNode'>
          if (valueNode.kind === Kind.VARIABLE) {
            selected = valueNode.name.value === arg.name
          }
        }
        return (
          <SelectableRow
            key={arg.name}
            name={arg.name}
            selected={selected}
            selectType={isScalarType(arg.type) ? 'variable' : undefined}
            type={arg.type}
            typeName={getTypeName(arg.type)}
            onSelect={() => onSelect(arg, selected, index)}
            onClick={() => onClick(arg)}
          />
        )
      })}
    </>
  )
}

export default Arguments
