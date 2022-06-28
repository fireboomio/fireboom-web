import type { DatasourceItem, DatasourceAction } from './datasource'
import type { DBSourceResp, SchemaResp, Block, Entity, Field, BlockAction } from './modeling'

interface Result<T> {
  result: T
}

export type {
  Result,
  DBSourceResp,
  SchemaResp,
  BlockAction,
  Block,
  Entity,
  Field,
  DatasourceItem,
  DatasourceAction,
}
