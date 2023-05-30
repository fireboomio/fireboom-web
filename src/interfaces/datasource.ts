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
  enabled: boolean
  readonly?: boolean
  config: Record<string, string | number | Record<string, any> | undefined>
}

export interface DMFResp {
  enums: string[] | null
  models: DMFModel[]
  schemaContent: string
}

export interface DMFModel {
  id: number
  name: string
  create: boolean
  delete: boolean
  update: boolean
  idField: 'id'
  displayFields: string[]
  fields: DMFField[]
}

export interface DMFField {
  id: string
  name: string
  title: string
  type: 'String' | 'Int' | string
  list: boolean
  kind: 'scalar' | 'object' | 'enum'
  read: boolean
  required: boolean
  isId: boolean
  unique: boolean
  create: boolean
  order: number
  update: boolean
  sort: boolean
  filter: boolean
  editor: boolean
  upload: boolean
  relationField: null
}

export interface TypeField {
  table: string
  field: string
  RespType: string
  InputType: string
  isActive: boolean
}

export interface ReplaceJSON {
  table: string
  field: string
  resType: string
  inputType: string
  isOpen?: boolean
}

export enum Mode {
  Input = '0',
  Env = '1'
}

export interface VariableType {
  key: string
  kind: Mode
  val: string
}
