import useSWRImmutable from 'swr/immutable'

import type { Connector } from '@/interfaces/connector'
import requests, { getFetcher } from '@/lib/fetchers'

export const useFetchConnector = () => {
  return useSWRImmutable<Connector[], Error>('/auth/linker', getFetcher)
}

export const deleteConnector: (id: string, enable: boolean) => Promise<void> = (id, enable) => {
  return requests.post('/auth/linker', { id, enable })
}

export const upsertConnector = (data: unknown) => {
  return requests.post('/auth/linker', data)
}
