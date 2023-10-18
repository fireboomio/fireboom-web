import type {
  DocumentNode,
  GraphQLArgument,
  GraphQLField,
  GraphQLFieldMap,
  GraphQLNamedOutputType,
  GraphQLObjectType,
  OperationDefinitionNode
} from 'graphql'
import { Kind, print } from 'graphql'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import { getCurrentFieldsFromStack, parseQuery } from './utils'

export type GraphQLObject = GraphQLObjectType<any, any> | GraphQLField<any, any, any>

export type GraphQLExplorerState = {
  fieldSort: Sort
  // 自动滚动
  autoScroll: boolean
  operationName?: string
  // operation 定义
  operationDefs: OperationDefinitionNode | null
  // 查询的 operation/field 栈
  graphqlObjectStack: GraphQLObject[]
  setGraphQLObjectStack: (v: GraphQLObject[]) => void
  // 根据 stack 查询当前展示的 fields
  currentFields: GraphQLNamedOutputType | GraphQLFieldMap<any, any> | null
  // 查询的参数栈
  argumentStack: GraphQLArgument[]
  setArgumentStack: (v: GraphQLArgument[]) => void
  // 更新 query
  updateGraphQLQuery: (def: OperationDefinitionNode | null) => void
  // 切换 fields 排序
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
  autoScroll?: boolean
  children?: ReactNode
  onChange?: (query: string) => void
}

const GraphQLExplorerProvider = ({
  operationName,
  query,
  autoScroll,
  children,
  onChange
}: GraphQLExplorerProviderProps) => {
  const [graphqlObjectStack, setGraphQLObjectStack] = useState<GraphQLObject[]>([])
  const [argumentStack, setArgumentStack] = useState<GraphQLArgument[]>([])

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
        autoScroll: autoScroll ?? true,
        operationName,
        operationDefs,
        graphqlObjectStack,
        setGraphQLObjectStack,
        currentFields: getCurrentFieldsFromStack(graphqlObjectStack),
        argumentStack,
        setArgumentStack,
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
