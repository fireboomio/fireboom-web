import { mutate } from 'swr'
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
  uploadProfiles: Record<string, Profile>
}

export interface Profile {
  maxAllowedUploadSizeBytes: number
  maxAllowedFiles: number
  allowedMimeTypes: string[]
  allowedFileExtensions: string[]
  metadataJSONSchema: string
  hooks: { preUpload: boolean; postUpload: boolean }
}

export interface Storage {
  id?: number
  name: string
  config: StorageConfig
  enabled: number
  deteleTime?: String
}

export function useStorageList() {
  return useSWRImmutable<Storage[]>('/storageBucket', requests.get).data
}

export function mutateStorage() {
  return mutate('/storageBucket')
}
