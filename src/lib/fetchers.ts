import { message } from 'antd'
import type { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios'
import axios from 'axios'
import { throttle } from 'lodash'
import { useSyncExternalStore } from 'react'

import { intl } from '@/providers/IntlProvider'

const requests = axios.create({
  baseURL: '/api',
  timeout: -1
})

const errToast = throttle(str => message.error(str), 1000)

requests.interceptors.response.use(
  (resp: AxiosResponse<any, any>) => {
    if (resp.status >= 200 && resp.status < 300) {
      // FIXME: 生效代码适配文件存储列表接口
      if (resp?.data?.code !== '10000000' && resp?.data?.code) {
        console.log(123123, resp.config)
        return resp.config.onError?.(resp.data)
      }
      return resp.data
    } else {
      // eslint-disable-next-line no-console
      const errMag = resp.config.resolveErrorMsg?.(resp)
      console.warn(resp.data.message)
      // @ts-ignore
      if (!resp.config.ignoreError) {
        void message.error(errMag ?? resp.data.message)
      }
    }
  },
  (error: AxiosError) => {
    // 请求超时提示
    // if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    //   // eslint-disable-next-line
    //   return Promise.reject('请检查网络再重新连接')
    // }
    if (error.response?.status === 401) {
      setAuthKey('')
    }
    const errMag = error?.config?.resolveErrorMsg?.(error.response)
    // @ts-ignore
    if (error?.response?.data?.cause) {
      // @ts-ignore
      console.warn(error?.response?.data?.cause)
    }
    // @ts-ignore
    if (!error.config.ignoreError) {
      let code
      try {
        // @ts-ignore
        code = error.response.data.code
      } catch (error) {
        //
      }
      // 20203 数据未发生变化
      // @ts-ignore
      if (!error.config.ignoreError) {
        if (code !== 20203) {
          errToast(
            errMag ??
              // @ts-ignore
              error?.response?.data?.message ??
              intl.formatMessage({ defaultMessage: '网络请求错误！' })
          )
        } else {
          // @ts-ignore
          message.warning(error.response.data.message)
        }
      }
      
    }
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
    'X-FB-Authentication': authKey ?? '',
    'X-FB-Locale': ''
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

export default requests

export const proxy = (url: string, cancelToken?: CancelToken) => {
  return axios
    .get(`/api/system/proxy?url=${encodeURIComponent(url)}`, {
      headers: getHeader(),
      cancelToken
    })
    .then(x => x.data)
}

export const simpleFetcher = (url: string) => fetch(url).then((res) => res.json())