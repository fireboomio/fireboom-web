import type { Schema } from '@paljs/types'

import type { FilterState } from '@/components/PrismaTable/libs/types'
import type { Block, DBSourceResp, Enum, Model } from '@/interfaces/modeling'

export interface Action<T> {
  type: string
  payload?: T
}

export interface PrismaSchemaPayload {
  blocks: Block[]
  dbSource: DBSourceResp
  schema: Schema
}

export interface RefetchPrismaSchemaPayload {
  blocks: Block[]
  schema: Schema
}

export interface InitialPrismaSchemaAction extends Action<PrismaSchemaPayload> {}

export interface RefetchPrismaSchemaAction extends Action<RefetchPrismaSchemaPayload> {}

export interface UpdateDraftBlockAction extends Action<Block> {}

export interface UpdateBlocksAction extends Action<Block[]> {}

export interface AddDraftBlockAction extends Action<Block> {}

export interface DeleteDraftBlockAction extends Action<Block> {}

export interface UpdateDraftEnumAction extends Action<Enum> {}

export interface InitCurrentEntityIdAction extends Action<number> {}

export interface UpdatePreviewFiltersAction extends Action<FilterState[]> {}

export interface UpdateDraftModelAction extends Action<Model> {}

export interface SaveGQLSchemaAction extends Action<Schema> {}

export interface CreateApolloClientAction extends Action<number> {}

export type AnyAction =
  | UpdateDraftEnumAction
  | InitialPrismaSchemaAction
  | RefetchPrismaSchemaAction
  | UpdateBlocksAction
  | UpdateDraftBlockAction
  | AddDraftBlockAction
  | DeleteDraftBlockAction
  | InitCurrentEntityIdAction
  | UpdateDraftModelAction
  | SaveGQLSchemaAction
  | UpdatePreviewFiltersAction
  | CreateApolloClientAction
