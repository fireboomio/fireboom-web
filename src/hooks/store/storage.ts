import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

export interface StorageConfig {
  name: string
  accessKeyID: { kind: string; val: string }
  secretAccessKey: { kind: string; val: string }
  bucketLocation: string
  bucketName: string
  endpoint: string
  useSSL: boolean
}

export interface Storage {
  id?: number
  name: string
  config: StorageConfig
  isDel: number
  switch: number
}

export function useStorageList() {
  return useSWRImmutable<Storage[]>('/storageBucket', url => requests.get<unknown, any>(url))
}
