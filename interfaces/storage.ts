export interface StorageResp {
  config: StorageConfig
  createTime: string
  id: number
  isDel: number
  name: string
  switch: number
  updateTime: string
}

export interface StorageConfig {
  accessKeyID: string
  secretAccessKey: string
  bucketLocation: string
  bucketName: string
  endpoint: string
  name: string
  useSSL: boolean
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
