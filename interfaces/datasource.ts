export type DatasourceAction = DatasourceSingleAction | DatasourceListAction

interface DatasourceSingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: DatasourceResp | DatasourceRequst
}
interface DatasourceListAction {
  type: 'fetched'
  data: DatasourceResp[]
}
export interface DatasourceResp {
  id: number
  name: string
  source_type: number
  switch: number
  config: {
    [key: string]: number | string | boolean
  }
}
export interface DatasourceRequst {
  name: string
  source_type: number
  switch: number
  config: string
}
