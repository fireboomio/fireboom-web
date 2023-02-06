import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

interface ApiSetting {
  enable: boolean
  authenticationRequired: boolean
  authenticationQueriesRequired: boolean
  authenticationMutationsRequired: boolean
  authenticationSubscriptionsRequired: boolean
  cachingEnable: boolean
  cachingMaxAge: number
  cachingStaleWhileRevalidate: number
  liveQueryEnable: boolean
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
  enable: boolean
  inlegal: boolean
  isPublic: boolean
  method: 'GET' | 'POST'
  operationType: 'query' | 'mutation' | 'subscription'
  children: OperationResp[] | null
  createTime: string
  updateTime: string
}

export function useApiList() {
  return useSWRImmutable<OperationResp[]>('/operateApi', url => requests.get(url))
}
