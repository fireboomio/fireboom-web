import { printSchema } from '@mrleebo/prisma-ast'

import type { DMMF } from '@/interfaces/dbml'
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

export const fetchPrismaDMF = (dbSourceName: string) => {
  return requests
    .get<any, DMMF.Document>(PRISMA_PREVIEW_GRAPHQL_SCHEMA.replace(':name', dbSourceName), {
      timeout: 15e3
    })
    .then(res => {
      res.datamodel.models = (res.datamodel.models ?? []).map(model => {
        let idField: string = ''
        const displayFields: string[] = []
        const modelFields: (DMMF.Field & {
          id: string
          title: string
          required: boolean
          order: number
        })[] = []
        for (const field of model.fields) {
          if (field.isId) {
            idField = field.name
          }
          if (field.kind === 'scalar') {
            displayFields.push(field.name)
          } else if (field.kind === 'object') {
            if (!field.relationToFields?.length) {
              continue
            }
            const str = JSON.stringify(field.relationToFields)
              .replace(/^[[\]]/, '')
              .replace(/[[\]]$/, '')
              .replace(/"/g, '')
            for (const name of str.split(',')) {
              displayFields.push(`${field.name}.${name}`)
            }
          }
          modelFields.push({
            ...field,
            id: `${model.name}.${field.name}`,
            title: field.name,
            required: field.hasDefaultValue ? false : field.isId ? true : field.isRequired,
            order: model.fields.indexOf(field) + 1
          })
        }
        return {
          id: model.name,
          idField,
          displayFields,
          ...model,
          fields: modelFields
        }
      })
      res.datamodel.enums = res.datamodel.enums ?? []
      return res
    })
}

export const fetchPrismaSDL = (dbSourceName: string) => {
  return requests.get<any, string>(`datasource/prisma/${dbSourceName}`, {
    timeout: 15e3
  })
}
