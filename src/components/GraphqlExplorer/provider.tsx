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
  fieldSort: Sort
  operationName?: string
  operationDefs: OperationDefinitionNode | null
  graphqlObjectStack: GraphQLObject[]
  setGraphQLObjectStack: (v: GraphQLObject[]) => void
  updateGraphQLQuery: (def: OperationDefinitionNode | null) => void
  toggleFieldSort: () => void
}

const GraphQLExplorerContext = createContext<GraphQLExplorerState>(
  // @ts-ignore
  null
)

const sortStoreKey = '_graphql.fields.sort'

type Sort = 'asc' | 'desc' | undefined | null

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

  const [sort, setSort] = useState<Sort>(localStorage.getItem(sortStoreKey) as Sort)

  function toggleFieldSort() {
    let target: Sort
    if (!sort) {
      target = 'desc'
    } else if (sort === 'asc') {
      target = null
    } else {
      target = 'asc'
    }
    setSort(target)
    if (target) {
      localStorage.setItem(sortStoreKey, target)
    } else {
      localStorage.removeItem(sortStoreKey)
    }
  }

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
        fieldSort: sort,
        operationName,
        operationDefs,
        graphqlObjectStack,
        setGraphQLObjectStack,
        updateGraphQLQuery,
        toggleFieldSort
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
