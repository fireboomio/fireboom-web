import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

export interface DatasourceResp {
  id: number
  name: string
  sourceType: number
  enabled: boolean
  config: Record<string, string | number | Record<string, any> | undefined>
  readonly?: boolean
}

export function useDataSourceList() {
  const data = useSWRImmutable<DatasourceResp[]>('/dataSource', requests.get).data
  data?.forEach(item => {
    item.readonly = item.name === 'system'
  })
  return data
}

export function mutateDataSource() {
  return mutate('/dataSource')
}
