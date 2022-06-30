import type { DatasourceItem, DatasourceAction, DatasourceResp } from './datasource'
import type {
  DBSourceResp,
  SchemaResp,
  Id,
  Entity,
  Block,
  Model,
  Enum,
  Field,
  BlockAction,
} from './modeling'

interface Result<T> {
  result: T
}

export type {
  Result,
  DBSourceResp,
  SchemaResp,
  BlockAction,
  Id,
  Entity,
  Block,
  Model,
  Enum,
  Field,
  DatasourceItem,
  DatasourceAction,
  DatasourceResp,
}
