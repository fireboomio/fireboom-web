export type DirTree = operationResp & { key: number | string }

export interface operationResp {
  title: string
  children: operationResp[] | null
}
