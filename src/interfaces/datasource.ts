export type ShowType = 'form' | 'detail' | 'setting' | 'db-select'

export type DatasourceAction = DatasourceSingleAction | DatasourceListAction

interface DatasourceSingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: DatasourceResp
}

interface DatasourceListAction {
  type: 'fetched'
  data: DatasourceResp[]
}

export interface DatasourceResp {
  id: number
  name: string
  sourceType: number
  switch: number
  config: {
    [key: string]: string | number | undefined
  }
}
