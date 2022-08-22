import { message } from 'antd'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { Result } from '@/interfaces/common'

const requests = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
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
      void message.error(resp.data.message)
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export const getFetcher = <T>(url: string, params?: Record<string, unknown>) =>
  requests.get<unknown, T>(url, { params: params }).then(res => {
    return res
  })

export default requests
