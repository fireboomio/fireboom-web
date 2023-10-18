import type { GraphQLObjectType, OperationDefinitionNode } from 'graphql'
import { Kind, OperationTypeNode } from 'graphql'
import type { Maybe } from 'graphql/jsutils/Maybe'
import { FormattedMessage } from 'react-intl'

import { useGraphQLExplorer } from './provider'
import SelectableRow from './SelectableRow'
import Title from './Title'

interface RootPanelProps {
  query: Maybe<GraphQLObjectType<any, any>>
  mutation: Maybe<GraphQLObjectType<any, any>>
  subscription: Maybe<GraphQLObjectType<any, any>>
}

const RootPanel = ({ query, mutation, subscription }: RootPanelProps) => {
  const { operationName, operationDefs, setGraphQLObjectStack, updateGraphQLQuery } =
    useGraphQLExplorer()
  function onSelect(optType: OperationTypeNode) {
    // 取消选择
    if (operationDefs?.operation === optType) {
      updateGraphQLQuery(null)
    } else {
      // 选择
      const def: OperationDefinitionNode = {
        kind: Kind.OPERATION_DEFINITION,
        operation: optType,
        name: { kind: Kind.NAME, value: operationName ?? `my${optType.toString()}` },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [{ kind: Kind.FIELD, name: { kind: Kind.NAME, value: ' ' } }]
        }
      }
      updateGraphQLQuery(def)
    }
  }
  function onEnterGraphQLObject(type: GraphQLObjectType<any, any>) {
    setGraphQLObjectStack([type])
  }
  return (
    <div>
      <Title>
        <FormattedMessage defaultMessage="请求类型" />
      </Title>
      {query && (
        <SelectableRow
          name="query"
          type={query.name}
          selected={operationDefs?.operation === OperationTypeNode.QUERY}
          onSelect={() => onSelect(OperationTypeNode.QUERY)}
          onClick={() => {
            onEnterGraphQLObject(query)
          }}
        />
      )}
      {mutation && (
        <SelectableRow
          name="mutation"
          type={mutation.name}
          selected={operationDefs?.operation === OperationTypeNode.MUTATION}
          onSelect={() => onSelect(OperationTypeNode.MUTATION)}
          onClick={() => {
            onEnterGraphQLObject(mutation)
          }}
        />
      )}
      {subscription && (
        <SelectableRow
          name="subscription"
          type={subscription.name}
          selected={operationDefs?.operation === OperationTypeNode.SUBSCRIPTION}
          onSelect={() => onSelect(OperationTypeNode.SUBSCRIPTION)}
          onClick={() => {
            onEnterGraphQLObject(subscription)
          }}
        />
      )}
    </div>
  )
}

export default RootPanel
