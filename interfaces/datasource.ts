export interface DatasourceItem {
  id: number
  name: string
  isEditing: boolean
  type: string
  info: {
    [key: string]: number | string | boolean
  }
}

export type DatasourceAction = DatasourceSingleAction | DatasourceListAction

interface DatasourceSingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: DatasourceItem
}
interface DatasourceListAction {
  type: 'fetched'
  data: DatasourceItem[]
}
export interface DatasourceResp {
  id: number
  name: string
  isEditing: boolean
  type: string
  info: {
    [key: string]: number | string | boolean
  }
}
