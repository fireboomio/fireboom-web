import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import type { DataSourceKind } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

export interface DataSourceResp {
  name: string
  sourceType: number
  enabled: boolean
  kind: DataSourceKind
  config: Record<string, string | number | Record<string, any> | undefined>
  readonly?: boolean
  customRest?: {
    oasFilepath: string
    baseUrl: string
    headers: Record<string, string> | null
  }
  customGraphql?: {
    endpoint: string
    headers: Record<string, string>
    customized: boolean
    schemaFilepath: string
  } | null
  customDatabase: {
    kind: number
    databaseUrl: string
    databaseAlone?: {
      host: string
      port: string
      database: string
      username: string
      password?: string
    }
  } | null
}

export function useDataSourceList() {
  const data = useSWRImmutable<ApiDocuments.Datasource[]>('/datasource', requests.get).data
  data?.forEach(item => {
    item.readonly = item.name === 'system'
  })
  return data
}

export function mutateDataSource() {
  return mutate('/datasource')
}
