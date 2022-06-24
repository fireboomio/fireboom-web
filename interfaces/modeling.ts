import type { Block as BlockT, Model, Enum } from '@mrleebo/prisma-ast'

export interface DBSourceResp {
  id: number
  name: string
}

export interface SchemaResp {
  id: number
  body: string
}

export type Block = BlockT & {
  id: number
}

export type Entity = (Model | Enum) & {
  id: number
}

export interface Field {
  property: string
  value: string
  note: string
  [key: string]: number | string | boolean
}
