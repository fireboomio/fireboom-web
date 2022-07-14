import axios, { AxiosError, AxiosResponse } from 'axios'

import { Result } from '@/interfaces/common'

const requests = axios.create({
  baseURL: '/api/v1',
  timeout: 3000,
})

requests.interceptors.response.use(
  <T>(resp: AxiosResponse<Result<T>>) => {
    if (resp.data.code >= 200 && resp.data.code < 300) {
      return resp.data.result ?? (resp.data as unknown as T)
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
  axios.get<Result<T>>(url, { params: params }).then((res) => {
    return res.data.result ?? (res.data as unknown as T)
  })

export default requests
