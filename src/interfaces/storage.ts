export type StorageResp = StorageT & {
  id: number
  createTime: string
  updateTime: string
}

export interface StorageT {
  id?: number
  name: string
  config: StorageConfig
  enabled: number
  deleteTime: string
}

export interface StorageConfig {
  name: string
  accessKeyID: { kind: string; val: string }
  secretAccessKey: { kind: string; val: string }
  bucketLocation: string
  bucketName: string
  endpoint: string
  useSSL: boolean
  uploadProfiles: any
}

export interface FileT {
  name: string
  size: number
  mime: string
  createTime: string
  updateTime: string
  isDir: boolean
  url: string
}

export type StorageAction = StorageSingleAction | StorageListAction

interface StorageSingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: StorageResp
}

interface StorageListAction {
  type: 'fetched'
  data: StorageResp[]
}
