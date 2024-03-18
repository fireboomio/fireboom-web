import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import type { Schema } from '@paljs/types'
import { createContext } from 'react'

import type { FilterState } from '@/components/PrismaTable/libs/types'
import type { Block } from '@/interfaces/modeling'
import type { BasicContextContainer } from '@/lib/context/baseContextContainer'
import type { ApiDocuments } from '@/services/a2s.namespace'

export type PrismaSchemaContextState = {
  blocks: Block[]
  originBlocks: Block[]
  delMap: Record<string, boolean>
  editMap: Record<string, boolean>
  newMap: Record<string, boolean>
  currentEntityId: number
  currentDBSource: ApiDocuments.Datasource
  previewFilters: FilterState[]
  schema: Schema
  apolloClient?: ApolloClient<NormalizedCacheObject> // 保存client对象在context中，减少切换model重新创建
}

export const emptyPrismaSchemaContextState: PrismaSchemaContextContainer = {
  panel: undefined,
  syncEditorFlag: false,
  triggerSyncEditor: () => {},
  state: {
    currentEntityId: 0,
    blocks: [],
    originBlocks: [],
    delMap: {},
    editMap: {},
    newMap: {},
    // @ts-ignore
    currentDBSource: {},
    previewFilters: [],
    schema: {
      models: [],
      enums: []
    }
  },
  dispatch: () => {
    return
  }
}

export type PrismaSchemaContextContainer = BasicContextContainer & {
  state: PrismaSchemaContextState
  panel: any
  syncEditorFlag: boolean
  triggerSyncEditor: () => void
  loadDataSource: () => Promise<void>
}

export const PrismaSchemaContext = createContext<PrismaSchemaContextContainer>(
  emptyPrismaSchemaContextState
)
