import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

export function useApiGlobalSetting() {
  return useSWRImmutable<ApiDocuments.GlobalOperation>('/globalOperation/single', requests.get)
}

export function useApiList() {
  return useSWRImmutable<ApiDocuments.fileloader_DataTree[]>('/operation/tree', requests.get).data
}

export function mutateApi() {
  return mutate('/operation')
}
