import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

export interface DatasourceResp {
  id: number
  name: string
  sourceType: number
  switch: number
  config: Record<string, string | number | Record<string, any> | undefined>
}

export function useDataSourceList() {
  return useSWRImmutable<DatasourceResp[]>('/dataSource', url => requests.get<unknown, any>(url))
}
