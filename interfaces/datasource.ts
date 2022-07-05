export interface DatasourceItem {
  id: number
  name: string
  type: string
  info: {
    [key: string]: number | string | boolean | unknown
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
  type: string
  info: {
    [key: string]: number | string | boolean
  }
}
