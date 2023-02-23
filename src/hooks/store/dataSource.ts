import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

export interface DatasourceResp {
  id: number
  name: string
  sourceType: number
  enabled: boolean
  config: Record<string, string | number | Record<string, any> | undefined>
}

export function useDataSourceList() {
  return useSWRImmutable<DatasourceResp[]>('/dataSource', requests.get).data
}

export function mutateDataSource() {
  return mutate('/dataSource')
}
