export type Datasource = {
  id: number
  name: string
}

export enum AuthType {
  RequireMatchAll = 0,
  RequireMatchAny = 1,
  DenyMatchAll = 2,
  DenyMatchAny = 3
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
  type: string
  show: boolean
  filter: boolean
  sort: boolean
  sortDirection: SortDirection
  create: KeyType
  update: KeyType
}
export type ApiOptions = {
  primaryKey: string
  prefix: string
  apiList: API[]
  auth: boolean
  authType: AuthType
  roleList: string[]
  table: Record<string, TableAttr>
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
