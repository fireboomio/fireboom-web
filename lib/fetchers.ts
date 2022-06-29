import axios from 'axios'

import { DBSourceResp, Result, SchemaResp, DatasourceResp } from '@/interfaces'

export const sourceFetcher = (url: string) =>
  axios.get<Result<DBSourceResp[]>>(url).then((res) => {
    return res.data.result
  })

export const schemaFetcher = (url: string, params?: Record<string, string>) =>
  axios.get<Result<SchemaResp>>(url, { params: params }).then((res) => {
    return res.data.result
  })

export const datasourceFetcher = (url: string, params?: Record<string, string>) =>
  axios.get<Result<DatasourceResp[]>>(url, { params: params }).then((res) => {
    return res.data.result
  })
