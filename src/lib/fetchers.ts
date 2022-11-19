import { message } from 'antd'
import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

import type { Result } from '@/interfaces/common'

const requests = axios.create({
  baseURL: '/api/v1',
  timeout: 5000
})

requests.interceptors.response.use(
  <T>(resp: AxiosResponse<Result<T>>) => {
    if (resp.status >= 200 && resp.status < 300) {
      // FIXME: 生效代码适配文件存储列表接口
      // return resp.data.result ?? (resp.data as unknown as T)
      return resp.data.result
    } else {
      // eslint-disable-next-line no-console
      const errMag = resp.config.resolveErrorMsg?.(resp)
      console.warn(resp.data.message)
      void message.error(errMag ?? resp.data.message)
    }
  },
  (error: AxiosError) => {
    const errMag = error.config.resolveErrorMsg?.(error.response)
    // @ts-ignore
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void message.error(errMag ?? error?.response?.data?.message ?? '网络请求错误！')
    return Promise.reject(error)
  }
)

export const getFetcher = <T>(url: string, params?: Record<string, unknown>) =>
  requests.get<unknown, T>(url, { params: params }).then(res => {
    return res
  })

export const NPM_RESOLVE_HOSE = 'http://8.142.115.204:9801'

export default requests
