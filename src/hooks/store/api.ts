import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

export function useApiGlobalSetting() {
  return useSWRImmutable<ApiDocuments.GlobalOperation>('/globalOperation', requests.get)
}

export interface OperationResp {
  id: number
  path: string
  content: string
  remark: string
  isDir: boolean
  liveQuery: boolean
  enabled: boolean
  illegal: boolean
  isPublic: boolean
  method: 'GET' | 'POST'
  operationType: 'query' | 'mutation' | 'subscription'
  children: OperationResp[] | null
  createTime: string
  updateTime: string
}

export function useApiList() {
  return useSWRImmutable<OperationResp[]>('/operation', requests.get).data
}

export function mutateApi() {
  return mutate('/operation')
}
