import type { DMFField, DMFModel } from '@/interfaces/datasource'

export type Datasource = {
  id: number
  name: string
  sourceType: number
  config: {
    apiNamespace: string
    dbType: string
  }
}

export enum AuthType {
  RequireMatchAll = 'requireMatchAll',
  RequireMatchAny = 'requireMatchAny',
  DenyMatchAll = 'denyMatchAll',
  DenyMatchAny = 'denyMatchAny'
}

export enum KeyType {
  Required = 'required',
  Optional = 'optional',
  Hidden = 'hidden'
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}
export interface _DMFModel extends DMFModel {
  fields: _DMFField[]
}
export interface _DMFField extends DMFField {
  hasDefault?: boolean
  isPrimaryKey?: boolean
  parentField?: _DMFField
  isForeign?: boolean
  children?: _DMFField[]
  tableId?: string
  originField?: _DMFField // 外键对应的原始字段
}

export type TableAttr = {
  name: string
  kind: string
  type: string
  createType: { isSet: boolean; name: string }
  updateType: { isSet: boolean; name: string }
  detail: boolean
  isDirectField: boolean
  list: boolean
  filter: boolean
  sort: boolean
  sortDirection: SortDirection
  create: KeyType
  update: KeyType
}
export type ApiOptions = {
  dbName: string
  primaryKey: string
  prefix: string
  alias: string
  modelName: string
  apiList: API[]
  authApiList: API[]
  auth: AuthOptions
  authType: AuthType
  roleList: string[]
  table: Record<string, TableAttr>
}

export enum AuthOptions {
  default = -1,
  enable = 1,
  disable = 0
}

export enum API {
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
  List = 'list',
  Detail = 'detail',
  BatchDelete = 'batchDelete',
  Export = 'export'
}

export enum ServiceStatus {
  Compiling = 1,
  Starting = 2,
  Running = 3,
  CompileFail = 4,
  StartFail = 5
}
