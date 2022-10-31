export type DirTreeNode = OperationItem & { key: string; children: DirTreeNode[] | null }

export type OperationItem = OperationResp & {
  title: string
  baseDir: string
  currDir: string
  liveQuery: boolean
  children: OperationItem[] | null
}

export interface OperationResp {
  id: number
  path: string
  content: string
  remark: string
  isDir: boolean
  liveQuery: boolean
  enable: boolean
  legal: boolean
  isPublic: boolean
  method: 'GET' | 'POST'
  operationType: 'query' | 'mutation' | 'subscription'
  children: OperationResp[] | null
  createTime: string
  updateTime: string
}

export interface FieldType {
  type: string
  isScalar: boolean
  isRequired: boolean
  isList: boolean
}

export interface TableSource {
  fieldName: string
  fieldType: FieldType
  directiveNames: string[] | undefined
  children?: TableSource[]
}

export interface ParameterT {
  key: string
  name: string
  position: string
  type: string
  isRequired: boolean
  directives?: DirectiveT[]
}

export interface DirectiveT {
  name: string
  args: ArgumentT[]
  payload: string[]
}

export interface ArgumentT {
  name: string
  value?: string[]
  rendered: string
}

export type HookName =
  | 'preResolve'
  | 'postResolve'
  | 'customResolve'
  | 'mutatingPreResolve'
  | 'mutatingPostResolve'
  | 'onRequest'
  | 'onResponse'

export interface HookResp {
  fileName: string
  content: string
  hookSwitch: boolean
  hookName: HookName
}

export interface MockResp {
  content: string
  mockSwitch: boolean
}

export interface SettingResp {
  authenticationRequired?: boolean
  cachingEnable?: boolean
  cachingMaxAge?: number
  cachingStaleWhileRevalidate?: number
  liveQueryEnable?: boolean
  liveQueryPollingIntervalSeconds?: number
}
