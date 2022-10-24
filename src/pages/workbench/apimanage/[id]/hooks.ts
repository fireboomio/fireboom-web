import { type SchemaContextProviderProps } from '@graphiql/react'
import type { DocumentNode, GraphQLSchema } from 'graphql'
import { createContext, useContext } from 'react'

export interface APIDesc {
  content: string
  enable: boolean
  id: number
  isDir: boolean
  isPublic: boolean
  legal: boolean
  method: string
  operationType: string
  path: string
  remark: string
  createTime: string
  updateTime: string
  restUrl: string
  setting: {
    authenticationRequired: boolean
    cachingEnable: boolean
    cachingMaxAge: number
    cachingStaleWhileRevalidate: number
    liveQueryEnable: boolean
    liveQueryPollingIntervalSeconds: number
  }
}

interface APIState {
  apiDesc?: APIDesc
  schema: GraphQLSchema | null
  query: string
  setQuery: (v: string) => void
  fetcher: SchemaContextProviderProps['fetcher']
  schemaAST?: DocumentNode
  updateAPI: (newAPI: Partial<APIDesc>) => Promise<void>
  updateContent: (content: string) => Promise<void>
  refreshAPI: () => void
  // 是否已保存
  saved: boolean
  setSaved: (v: boolean) => void
}

// @ts-ignore
export const APIContext = createContext<APIState>(null)

export function useAPIManager() {
  return useContext<APIState>(APIContext)
}
