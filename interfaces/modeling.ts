import type { Block as BlockT, Model as ModelT, Enum as EnumT } from '@mrleebo/prisma-ast'

export interface DBSourceResp {
  id: number
  name: string
}

export interface SchemaResp {
  id: number
  body: string
}

export type BlockAction = BlockSingleAction | BlockListAction

interface BlockSingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: Block
}

interface BlockListAction {
  type: 'fetched'
  data: Block[]
}

export interface Id {
  id: number
}

export type Entity = Model | Enum
export type Block = BlockT & Id
export type Model = ModelT & Id
export type Enum = EnumT & Id

export interface Field {
  property: string
  value: string
  note: string
  [key: string]: number | string | boolean
}
