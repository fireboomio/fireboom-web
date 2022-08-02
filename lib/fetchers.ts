import axios, { AxiosError, AxiosResponse } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

import { Result } from '@/interfaces/common'

const requests = applyCaseMiddleware(
  axios.create({
    baseURL: '/api/v1',
    timeout: 3000,
  }),
  { caseMiddleware: { requestInterceptor: (x) => x } }
)

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
    return Promise.reject(error)
  }
)

export const getFetcher = <T>(url: string, params?: Record<string, string>) =>
  requests.get<unknown, T>(url, { params: params }).then((res) => {
    return res
  })

export default requests
