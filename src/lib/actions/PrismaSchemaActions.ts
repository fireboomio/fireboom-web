import type { Schema } from '@paljs/types'

import type { FilterState } from '@/components/PrismaTable/libs/types'
import type { Block, DBSourceResp } from '@/interfaces/modeling'

import type {
  CreateApolloClientAction,
  InitCurrentEntityIdAction,
  InitialPrismaSchemaAction,
  LocalPrismaSchemaAction,
  RefetchPrismaSchemaAction,
  SaveGQLSchemaAction,
  UpdateBlocksAction,
  UpdatePreviewFiltersAction
} from './ActionTypes'

export const INITIAL_PRISMA_SCHEMA_ACTION = 'fetch_blocks'
export const REFETCH_PRISMA_SCHEMA_ACTION = 'refetch_blocks'
export const LOCAL_PRISMA_SCHEMA_ACTION = 'local_blocks'
export const UPDATE_BLOCKS_ACTION = 'update_blocks'
export const UPDATE_CURRENT_ENTITY_ID_ACTION = 'update_current_entity_id'
export const UPDATE_PREVIEW_FILTERS_ACTION = 'update_preview_filters'
export const SAVE_GQL_SCHEMA_ACTION = 'save_gql_schema'
export const CREATE_APOLLO_CLIENT_ACTION = 'create_apollo_client'

export const initialPrismaSchemaAction = (
  draft: Block[],
  dbSource: DBSourceResp,
  schema: Schema
): InitialPrismaSchemaAction => ({
  type: INITIAL_PRISMA_SCHEMA_ACTION,
  payload: {
    blocks: draft,
    originBlocks: draft,
    dbSource,
    schema
  }
})

export const refetchPrismaSchemaAction = (
  blocks: Block[],
  schema: Schema
): RefetchPrismaSchemaAction => ({
  type: REFETCH_PRISMA_SCHEMA_ACTION,
  payload: {
    blocks,
    originBlocks: blocks,
    schema
  }
})
export const localPrismaSchemaAction = (blocks: Block[]): LocalPrismaSchemaAction => ({
  type: LOCAL_PRISMA_SCHEMA_ACTION,
  payload: {
    blocks
  }
})

export const updateBlocksAction = (payload: Block[]): UpdateBlocksAction => ({
  type: UPDATE_BLOCKS_ACTION,
  payload
})

export const updateCurrentEntityIdAction = (payload: number): InitCurrentEntityIdAction => ({
  type: UPDATE_CURRENT_ENTITY_ID_ACTION,
  payload
})

export const updatePreviewFiltersAction = (payload: FilterState[]): UpdatePreviewFiltersAction => ({
  type: UPDATE_PREVIEW_FILTERS_ACTION,
  payload
})

export const saveGqlSchemaAction = (payload: Schema): SaveGQLSchemaAction => ({
  type: SAVE_GQL_SCHEMA_ACTION,
  payload
})

export const createApolloClient = (payload: number): CreateApolloClientAction => ({
  type: CREATE_APOLLO_CLIENT_ACTION,
  payload
})
