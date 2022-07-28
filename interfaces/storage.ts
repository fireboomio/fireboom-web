export interface FileStorageResp {
  config: string
  create_time: string
  id: number
  is_del: number
  name: string
  switch: number
  update_time: string
}
export interface FileStorageRequest {
  config: string
  create_time: string
  is_del: number
  name: string
  switch: number
  update_time: string
}

export type FlieAction = FilesingleAction | FilesListAction

interface FilesingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: FileStorageResp
}

interface FilesListAction {
  type: 'fetched'
  data: FileStorageResp[]
}
