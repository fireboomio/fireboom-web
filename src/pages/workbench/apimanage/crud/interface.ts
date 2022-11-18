export type Datasource = {
  id: number
  name: string
  config: {
    apiNamespace: string
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

export type TableAttr = {
  name: string
  kind: string
  type: string
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
