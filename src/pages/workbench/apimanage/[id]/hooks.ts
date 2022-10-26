import { type SchemaContextProviderProps } from '@graphiql/react'
import type { DocumentNode, GraphQLSchema, OperationTypeNode } from 'graphql'
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
  apiID: string
  apiContainerRef: HTMLDivElement | null
  apiDesc?: APIDesc
  schema: GraphQLSchema | null
  query: string
  setQuery: (v: string) => void
  fetcher: SchemaContextProviderProps['fetcher']
  schemaAST?: DocumentNode
  operationType?: OperationTypeNode
  updateAPI: (newAPI: Partial<APIDesc>) => Promise<void>
  updateContent: (content: string) => Promise<boolean>
  refreshAPI: () => void
  appendToAPIRefresh: (fn: () => void) => void
  // 是否已保存
  saved: boolean
}

// @ts-ignore
export const APIContext = createContext<APIState>(null)

export function useAPIManager() {
  return useContext<APIState>(APIContext)
}
