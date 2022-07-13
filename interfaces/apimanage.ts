export type DirTree = operationResp & { key: number | string }

export interface operationResp {
  title: string
  children: operationResp[] | null
  originTitle?: string
  path?: string
}

export interface FieldType {
  kind: string
  isRequired: boolean
  isList: boolean
}

export interface TableSource {
  fieldName: string
  fieldType: FieldType
  children?: TableSource[]
}
