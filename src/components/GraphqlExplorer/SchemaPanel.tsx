import { GraphQLObjectType } from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import GraphQLObjectPanel from './GraphQLObjectPanel'
import { useGraphQLExplorer } from './provider'
import RootPanel from './RootPanel'

interface SchemaPanelProps {
  query: Maybe<GraphQLObjectType<any, any>>
  mutation: Maybe<GraphQLObjectType<any, any>>
  subscription: Maybe<GraphQLObjectType<any, any>>
}

const SchemaPanel = ({ query, mutation, subscription }: SchemaPanelProps) => {
  const { graphqlObjectStack } = useGraphQLExplorer()
  return (
    <>
      {graphqlObjectStack.length ? (
        <GraphQLObjectPanel obj={graphqlObjectStack[graphqlObjectStack.length - 1]} />
      ) : (
        <RootPanel query={query} mutation={mutation} subscription={subscription} />
      )}
    </>
  )
}

export default SchemaPanel
