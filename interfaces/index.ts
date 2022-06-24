import type { DatasourceItem } from './datasource'
import type { DBSourceResp, SchemaResp, Block, Entity, Field } from './modeling'

interface Result<T> {
  result: T
}

export type { Result, DBSourceResp, SchemaResp, Block, Entity, Field, DatasourceItem }
