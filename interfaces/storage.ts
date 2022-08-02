export type StorageResp = StorageT & {
  id: number
  createTime: string
  updateTime: string
}

export interface StorageT {
  id?: number
  name: string
  config: StorageConfig
  isDel: number
  switch: number
}

export interface StorageConfig {
  name: string
  accessKeyID: string
  secretAccessKey: string
  bucketLocation: string
  bucketName: string
  endpoint: string
  useSSL: boolean
}

export interface FileT {
  name: string
  size: string
  mime: string
  createTime: string
  updateTime: string
  isDir: boolean
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
