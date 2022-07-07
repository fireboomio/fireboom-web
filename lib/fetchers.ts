import axios from 'axios'

import { AuthProvItem } from '@/interfaces/auth'
import { Result } from '@/interfaces/common'
import { DatasourceResp } from '@/interfaces/datasource'
import { FileStorageItem } from '@/interfaces/filestorage'
import { DBSourceResp, SchemaResp } from '@/interfaces/modeling'

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

export const fileStorageFetcher = (url: string, params?: Record<string, string>) =>
  axios.get<Result<FileStorageItem[]>>(url, { params: params }).then((res) => {
    return res.data.result
  })

export const authFetcher = (url: string, params?: Record<string, string>) =>
  axios.get<Result<AuthProvItem[]>>(url, { params: params }).then((res) => {
    return res.data.result
  })
