import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import type { Schema } from '@paljs/types'
import { createContext } from 'react'

import type { FilterState } from '@/components/PrismaTable/libs/types'
import type { Block, DBSourceResp } from '@/interfaces/modeling'
import type { BasicContextContainer } from '@/lib/context/baseContextContainer'

export type PrismaSchemaContextState = {
  blocks: Block[]
  currentEntityId: number
  currentDBSource: DBSourceResp
  previewFilters: FilterState[]
  schema: Schema
  apolloClient?: ApolloClient<NormalizedCacheObject> // 保存client对象在context中，减少切换model重新创建
}

export const emptyPrismaSchemaContextState: PrismaSchemaContextContainer = {
  state: {
    currentEntityId: 0,
    blocks: [],
    currentDBSource: {
      id: 0,
      name: '',
      sourceType: 1,
      config: {
        dbType: 'MySQL',
        apiNamespace: ''
      }
    },
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
}

export const PrismaSchemaContext = createContext<PrismaSchemaContextContainer>(
  emptyPrismaSchemaContextState
)