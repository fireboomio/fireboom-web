import { message } from 'antd'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import { intl } from '@/providers/IntlProvider'

const requests = axios.create({
  baseURL: '/api/v1',
  timeout: 5000
})

requests.interceptors.response.use(
  <T>(resp: AxiosResponse<any, any>) => {
    if (resp.status === 401 || resp.config.url == '/storageBucket') {
      invalidCallback?.()
      setAuthKey('')
    }
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
    const errMag = error?.config?.resolveErrorMsg?.(error.response)
    message.error(
      errMag ??
        // @ts-ignore
        error?.response?.data?.message ??
        intl.formatMessage({ defaultMessage: '网络请求错误！' })
    )
    return Promise.reject(error)
  }
)
const AUTH_STORAGE_KEY = '__fb_authKey'
let authKey = localStorage.getItem(AUTH_STORAGE_KEY)
let invalidCallback: (() => void) | undefined
requests.interceptors.request.use((config: AxiosRequestConfig<any>) => {
  config.headers = config.headers || {}
  // @ts-ignore
  config.headers['X-FB-Authentication'] = authKey ?? ''
  return config
})
axios.interceptors.request.use((config: AxiosRequestConfig<any>) => {
  // @ts-ignore
  config.headers['X-FB-Authentication'] = authKey ?? ''
  return config
})

export const hasAuthKey = () => {
  return !!authKey
}

export function setAuthKey(key: string, callback?: () => void) {
  authKey = key
  invalidCallback = callback
  localStorage.setItem(AUTH_STORAGE_KEY, key)
}
export function getAuthKey() {
  return authKey
}
export const getFetcher = <T>(
  url: string,
  params?: Record<string, unknown>,
  config?: Record<string, unknown>
) => {
  requests.get<unknown, T>(url, { ...config, params: params }).then(res => {
    return res
  })
}

export const NPM_RESOLVE_HOSE = 'http://8.142.115.204:9801'

export default requests
