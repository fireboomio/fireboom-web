export type DirTree = operationResp & { key: number | string }

export interface operationResp {
  title: string
  children: operationResp[] | null
  originTitle?: string
  path?: string
  disable: boolean
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
