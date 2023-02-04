import { message } from 'antd'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { throttle } from 'lodash'
import { useSyncExternalStore } from 'react'

import { intl } from '@/providers/IntlProvider'

const requests = axios.create({
  baseURL: '/api/v1',
  timeout: 5000
})

const errToast = throttle(str => message.error(str), 1000)

requests.interceptors.response.use(
  <T>(resp: AxiosResponse<any, any>) => {
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
    if (error.response?.status === 401) {
      setAuthKey('')
    }
    const errMag = error?.config?.resolveErrorMsg?.(error.response)
    errToast(
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

export const getHeader = () => {
  return {
    ['X-FB-Authentication']: authKey ?? ''
  }
}

let authChangeCallback: (() => void) | undefined
export const useAuthState = () => {
  const subscribe = (cb: any) => {
    authChangeCallback = cb
    return () => {
      authChangeCallback = undefined
    }
  }
  return useSyncExternalStore(subscribe, () => hasAuthKey())
}
export function setAuthKey(key: string) {
  authKey = key
  authChangeCallback?.()
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
  return requests.get<unknown, T>(url, { ...config, params: params }).then(res => {
    return res
  })
}

export const NPM_RESOLVE_HOSE = 'http://8.142.115.204:9801'

export default requests
