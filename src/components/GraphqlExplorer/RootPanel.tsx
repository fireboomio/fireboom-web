import type { GraphQLObjectType } from 'graphql'
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
  const { setGraphqlObjectStack } = useGraphQLExplorer()
  function onSelect() {}
  function onEnterGraphQLObject(type: GraphQLObjectType<any, any>) {
    setGraphqlObjectStack([type])
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
          onSelect={() => {}}
          onClick={() => {
            onEnterGraphQLObject(query)
          }}
        />
      )}
      {mutation && (
        <SelectableRow
          name="mutation"
          type={mutation.name}
          onSelect={() => {}}
          onClick={() => {
            onEnterGraphQLObject(mutation)
          }}
        />
      )}
      {subscription && (
        <SelectableRow
          name="subscription"
          type={subscription.name}
          onSelect={() => {}}
          onClick={() => {
            onEnterGraphQLObject(subscription)
          }}
        />
      )}
    </div>
  )
}

export default RootPanel
