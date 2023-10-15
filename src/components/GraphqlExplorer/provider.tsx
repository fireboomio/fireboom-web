import type {
  DocumentNode,
  GraphQLField,
  GraphQLObjectType,
  OperationDefinitionNode
} from 'graphql'
import { Kind, print } from 'graphql'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import { parseQuery } from './utils'

export type GraphQLObject = GraphQLObjectType<any, any> | GraphQLField<any, any, any>

export type GraphQLExplorerState = {
  operationName?: string
  operationDefs: OperationDefinitionNode | null
  graphqlObjectStack: GraphQLObject[]
  setGraphQLObjectStack: (v: GraphQLObject[]) => void
  updateGraphQLQuery: (def: OperationDefinitionNode | null) => void
}

const GraphQLExplorerContext = createContext<GraphQLExplorerState>(
  // @ts-ignore
  null
)

interface GraphQLExplorerProviderProps {
  operationName?: string
  query?: string
  children?: ReactNode
  onChange?: (query: string) => void
}

const GraphQLExplorerProvider = ({
  operationName,
  query,
  children,
  onChange
}: GraphQLExplorerProviderProps) => {
  const [graphqlObjectStack, setGraphQLObjectStack] = useState<GraphQLObject[]>([])
  const operationDefs = useMemo<OperationDefinitionNode | null>(() => {
    if (query) {
      const ast = parseQuery(query)
      if (ast) {
        // TODO 后续支持数组
        return ast.definitions?.find(
          def => def.kind === Kind.OPERATION_DEFINITION
        ) as OperationDefinitionNode
      }
    }
    return null
  }, [query])

  function updateGraphQLQuery(def: OperationDefinitionNode | null) {
    if (!def) {
      onChange?.('')
    }
    const ast: DocumentNode = {
      kind: Kind.DOCUMENT,
      definitions: [def!]
    }
    onChange?.(print(ast))
  }

  return (
    <GraphQLExplorerContext.Provider
      value={{
        operationName,
        operationDefs,
        graphqlObjectStack,
        setGraphQLObjectStack,
        updateGraphQLQuery
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
