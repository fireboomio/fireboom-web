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
  source_type: number
  switch: number
  config: string
}
export interface DatasourceRequst {
  name: string
  source_type: number
  switch: number
  config: string
}
