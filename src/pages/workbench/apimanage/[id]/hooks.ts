import { type SchemaContextProviderProps } from '@graphiql/react'
import type { DocumentNode, GraphQLSchema } from 'graphql'
import { createContext, useContext } from 'react'

interface APIState {
  apiDesc: any
  schema: GraphQLSchema | null
  query: string
  setQuery: (v: string) => void
  fetcher: SchemaContextProviderProps['fetcher']
  schemaAST?: DocumentNode
}

export const APIContext = createContext<APIState>({
  apiDesc: null,
  schema: null,
  query: '',
  setQuery() {},
  // @ts-ignore
  async fetcher() {}
})

export function useAPIManager() {
  return useContext<APIState>(APIContext)
}
