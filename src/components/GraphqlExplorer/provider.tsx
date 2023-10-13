import { GraphQLField, GraphQLObjectType } from 'graphql'
import { createContext, ReactNode, useContext, useState } from 'react'

export type GraphQLObject = GraphQLObjectType<any, any> | GraphQLField<any, any, any>

export type GraphQLExplorerState = {
  graphqlObjectStack: GraphQLObject[]
  setGraphqlObjectStack: (v: GraphQLObject[]) => void
}

const GraphQLExplorerContext = createContext<GraphQLExplorerState>(
  // @ts-ignore
  null
)

const GraphQLExplorerProvider = ({ children }: { children?: ReactNode }) => {
  const [graphqlObjectStack, setGraphqlObjectStack] = useState<GraphQLObject[]>([])

  return (
    <GraphQLExplorerContext.Provider
      value={{
        graphqlObjectStack,
        setGraphqlObjectStack
      }}
    >
      {children}
    </GraphQLExplorerContext.Provider>
  )
}

export default GraphQLExplorerProvider

export function useGraphQLExplorer() {
  return useContext(GraphQLExplorerContext)
}
