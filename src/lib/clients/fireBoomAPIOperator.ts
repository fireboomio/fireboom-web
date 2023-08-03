import { printSchema } from '@mrleebo/prisma-ast'

import type { Block, PrismaDMF } from '@/interfaces/modeling'
import {
  DATABASE_SOURCE,
  MAGIC_DELETE_ENTITY,
  MIGRATE_PRISMA_SCHEMA_BY_DB_SOURCE_NAME,
  PRISMA_PREVIEW_GRAPHQL_SCHEMA
} from '@/lib/constants/fireBoomConstants'
import requests, { getFetcher } from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

export const fetchDBSources = () => getFetcher<ApiDocuments.Datasource[]>(`${DATABASE_SOURCE}`)

export const migratePrismaSchema = (blocks: Block[], dbSourceName: string) => {
  if (!blocks.find(b => ['enum', 'model'].includes(b.type))) {
    // 处理将实体全部删除的情况，添加一个额外的实体 fb_delete
    blocks.push(MAGIC_DELETE_ENTITY)
  }
  const migratePrismaUrl = MIGRATE_PRISMA_SCHEMA_BY_DB_SOURCE_NAME.replace(':name', dbSourceName)
  const prismaSchema = printSchema({ type: 'schema', list: blocks })
  return requests.post(
    migratePrismaUrl,
    {
      schema: prismaSchema
    },
    { timeout: 30e3 }
  )
}

export const fetchPrismaDMF = (dbSourceName: string) =>
  getFetcher<PrismaDMF>(PRISMA_PREVIEW_GRAPHQL_SCHEMA.replace(':name', dbSourceName), undefined, {
    timeout: 15e3
  }).then(res => {
    res.models = res.models ?? []
    res.enums = res.enums ?? []
    return res
  })
