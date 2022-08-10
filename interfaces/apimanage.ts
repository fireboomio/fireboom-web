export type DirTree = operationItem & { key: number | string }

export type operationItem = operationResp & {
  originTitle?: string
  path?: string
}

type PUBLIC = true
type PRIVATE = false

export interface operationResp {
  id: number
  title: string
  legal: boolean
  enable: boolean
  content: string
  method: 'GET' | 'POST'
  operationType: 'queries' | 'mutations' | 'subscriptions'
  remark: string
  status: PUBLIC | PRIVATE
  children: operationResp[] | null
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
