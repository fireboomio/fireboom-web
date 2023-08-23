import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

export function useStorageList() {
  return useSWRImmutable<ApiDocuments.Storage[]>('/storage', requests.get).data
}

export function mutateStorage() {
  return mutate('/storage')
}
