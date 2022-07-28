export interface StorageResp {
  config: string
  createTime: string
  id: number
  isDel: number
  name: string
  switch: number
  updateTime: string
}

export interface StorageRequest {
  config: string
  create_time: string
  is_del: number
  name: string
  switch: number
  update_time: string
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
