import type { Schema } from '@paljs/types'

import type { FilterState } from '@/components/PrismaTable/libs/types'
import type { Block, Entity } from '@/interfaces/modeling'
import type {
  AnyAction,
  PrismaSchemaPayload,
  RefetchPrismaSchemaPayload
} from '@/lib/actions/ActionTypes'
import {
  CREATE_APOLLO_CLIENT_ACTION,
  INITIAL_PRISMA_SCHEMA_ACTION,
  REFETCH_PRISMA_SCHEMA_ACTION,
  SAVE_GQL_SCHEMA_ACTION,
  UPDATE_BLOCKS_ACTION,
  UPDATE_CURRENT_ENTITY_ID_ACTION,
  UPDATE_PREVIEW_FILTERS_ACTION
} from '@/lib/actions/PrismaSchemaActions'
import { buildPrismaTableApolloClientByDataSourceId } from '@/lib/clients/PrismaTableApolloClient'
import type { PrismaSchemaContextState } from '@/lib/context/PrismaSchemaContext'

const getFirstEntityId = (blocks: Block[]) => {
  return (blocks.filter(p => ['model', 'enum'].includes(p.type)).at(0) as Entity)?.id ?? 0
}

const initialPrismaSchema = (
  state: PrismaSchemaContextState,
  { blocks, dbSource, schema }: PrismaSchemaPayload
) => ({
  currentEntityId: getFirstEntityId(blocks),
  blocks: blocks,
  currentDBSource: dbSource,
  previewFilters: [],
  schema
})

const refetchPrismaSchema = (
  state: PrismaSchemaContextState,
  { blocks, schema }: RefetchPrismaSchemaPayload
) => {
  return {
    ...state,
    blocks,
    schema
  }
}

const updateDraftBlocks = (state: PrismaSchemaContextState, payload: Block[]) => ({
  ...state,
  blocks: payload
})

const updateCurrentEntityId = (state: PrismaSchemaContextState, currentEntityId: number) => ({
  ...state,
  currentEntityId
})

const updatePreviewFilters = (state: PrismaSchemaContextState, filters: FilterState[]) => ({
  ...state,
  previewFilters: filters
})

const saveGqlSchema = (state: PrismaSchemaContextState, payload: Schema) => ({
  ...state,
  schema: payload
})

const createApolloClientForDataSource = (
  state: PrismaSchemaContextState,
  dataSourceId: number
) => ({
  ...state,
  apolloClient: buildPrismaTableApolloClientByDataSourceId(String(dataSourceId))
})

const modelingReducer = (
  state: PrismaSchemaContextState,
  action: AnyAction
): PrismaSchemaContextState => {
  switch (action.type) {
    case INITIAL_PRISMA_SCHEMA_ACTION:
      return initialPrismaSchema(state, action.payload as PrismaSchemaPayload)
    case REFETCH_PRISMA_SCHEMA_ACTION:
      return refetchPrismaSchema(state, action.payload as RefetchPrismaSchemaPayload)
    case UPDATE_BLOCKS_ACTION:
      return updateDraftBlocks(state, action.payload as Block[])
    case UPDATE_CURRENT_ENTITY_ID_ACTION:
      return updateCurrentEntityId(state, action.payload as number)
    case UPDATE_PREVIEW_FILTERS_ACTION:
      return updatePreviewFilters(state, action.payload as FilterState[])
    case SAVE_GQL_SCHEMA_ACTION:
      return saveGqlSchema(state, action.payload as Schema)
    case CREATE_APOLLO_CLIENT_ACTION:
      return createApolloClientForDataSource(state, action.payload as number)
    default:
      return state
  }
}

export default modelingReducer
