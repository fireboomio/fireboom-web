import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

export function useAuthList() {
  return useSWRImmutable<ApiDocuments.Authentication[]>('/authentication', requests.get).data
}

export function mutateAuth() {
  return mutate('/authentication')
}
