import type { Block as BlockT, Enum as EnumT, Model as ModelT } from '@mrleebo/prisma-ast'
import type { Schema } from '@paljs/types'

// support the following 3 options for now
export type DBSourceType = 'SQLITE' | 'MONGODB' | 'PGSQL' | 'MySQL'

export interface DBSourceResp {
  id: string
  name: string
  sourceType: number // 1-db 2-rest 3-graphql 4-自定义
  config: {
    dbType: DBSourceType
    apiNamespace: string
  }
}

export type SchemaContent = string

export type PrismaDMF = Schema & { schemaContent: SchemaContent }

export interface Id {
  id: number
}

export type Entity = Model | Enum
export type Block = BlockT & Id
export type Model = ModelT & Id
export type Enum = EnumT & Id

export type ModelingShowTypeT =
  | 'editModel'
  | 'editEnum'
  | 'preview'
  | 'erDiagram'
  | 'newModel'
  | 'newEnum'
