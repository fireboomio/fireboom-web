export interface FileStorageItem {
  id: number
  name: string
  info: {
    [key: string]: number | string | boolean | []
  }
}

export type FlieAction = FilesingleAction | FilesListAction

interface FilesingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: FileStorageItem
}

interface FilesListAction {
  type: 'fetched'
  data: FileStorageItem[]
}
