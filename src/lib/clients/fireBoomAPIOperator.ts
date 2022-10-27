import { printSchema } from '@mrleebo/prisma-ast'
import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

import type { Result } from '@/interfaces/common'
import type { Block, DBSourceResp, PrismaDMF } from '@/interfaces/modeling'
import {
  BASE_URL,
  DATABASE_SOURCE,
  MAGIC_DELETE_ENTITY,
  MIGRATE_PRISMA_SCHEMA_BY_DB_SOURCE_ID,
  PRISMA_PREVIEW_GRAPHQL_SCHEMA
} from '@/lib/constants/fireBoomConstants'

const requests = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

requests.interceptors.response.use(
  <T>(resp: AxiosResponse<Result<T>>) => {
    if (resp.status >= 200 && resp.status < 300) {
      // FIXME: 生效代码适配文件存储列表接口
      // return resp.data.result ?? (resp.data as unknown as T)
      return resp.data.result
    } else {
      // eslint-disable-next-line no-console
      console.warn(resp.data.message)
    }
  },
  (error: AxiosError) => {
    const errorMessage = error.response?.data
    return Promise.reject(errorMessage || error.message)
  }
)

export const getFetcher = <T>(url: string, params?: Record<string, string>) =>
  requests.get<unknown, T>(url, { params: params }).then(res => {
    return res
  })

export const fetchDBSources = () =>
  getFetcher<DBSourceResp[]>(`${DATABASE_SOURCE}?datasourceType=1`)

export const migratePrismaSchema = (blocks: Block[], dbSourceId: number) => {
  if (!blocks.find(b => ['enum', 'model'].includes(b.type))) {
    // 处理将实体全部删除的情况，添加一个额外的实体 fb_delete
    blocks.push(MAGIC_DELETE_ENTITY)
  }
  const migratePrismaUrl = MIGRATE_PRISMA_SCHEMA_BY_DB_SOURCE_ID.replace(':id', String(dbSourceId))
  const prismaSchema = printSchema({ type: 'schema', list: blocks })
  return requests.post(migratePrismaUrl, {
    schema: prismaSchema
  })
}

export const fetchPrismaDMF = (dbSourceId: string) =>
  getFetcher<PrismaDMF>(PRISMA_PREVIEW_GRAPHQL_SCHEMA.replace(':id', dbSourceId))
