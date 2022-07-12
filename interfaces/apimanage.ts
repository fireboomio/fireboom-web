export type DirTree = operationResp & { key: number | string }

export interface operationResp {
  title: string
  children: operationResp[] | null
  originTitle?: string
  path?: string
}

export interface TableSource {
  fieldName: string
  fieldType: string
  children?: TableSource[]
}
