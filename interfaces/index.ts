import type { DBSourceResp, SchemaResp, Entity, Field } from './modeling'

interface Result<T> {
  result: T
}

export type { Result, DBSourceResp, SchemaResp, Entity, Field }
