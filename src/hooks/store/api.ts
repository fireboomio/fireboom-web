import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

interface ApiSetting {
  enabled: boolean
  authenticationRequired: boolean
  authenticationQueriesRequired: boolean
  authenticationMutationsRequired: boolean
  authenticationSubscriptionsRequired: boolean
  cachingEnabled: boolean
  cachingMaxAge: number
  cachingStaleWhileRevalidate: number
  liveQueryEnabled: boolean
  liveQueryPollingIntervalSeconds: number
}
export function useApiGlobalSetting() {
  return useSWRImmutable<ApiSetting>('/operateApi/setting', url => requests.get(url))
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
  return useSWRImmutable<OperationResp[]>('/operateApi', requests.get).data
}

export function mutateApi() {
  return mutate('/operateApi')
}
