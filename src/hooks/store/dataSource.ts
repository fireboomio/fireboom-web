import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import type { DataSourceKind } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'

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
    url: string
    headers: Record<string, string>
    customized: boolean
    schemaString: string
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
  const data = useSWRImmutable<DataSourceResp[]>('/datasource', requests.get).data
  data?.forEach(item => {
    item.readonly = item.name === 'system'
  })
  return data
}

export function mutateDataSource() {
  return mutate('/dataSource')
}
