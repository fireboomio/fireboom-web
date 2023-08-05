/* eslint-disable */
import axios from 'axios'
import { RequestFunctionArgs, ResponseObject } from './a2s.types'

const AUTH_STORAGE_KEY = '__fb_authKey'

let _key = localStorage.getItem(AUTH_STORAGE_KEY)

export function getAuthKey() {
  return _key
}

export function setAuthKey(_newKey: string) {
  _key = _newKey
}

export async function requestAdapter<T>(args: RequestFunctionArgs): Promise<ResponseObject<T>> {
  const { url, method, query, body, done = true } = args
  const authKey = getAuthKey()
  try {
    const { status, data, statusText } = await axios.request({
      url,
      method,
      baseURL: '/api',
      params: query,
      data: body,
      responseType: 'json',
      headers: authKey
        ? {
            'X-FB-Authentication': authKey
          }
        : {}
    })
    if (status < 300 && status >= 200) {
      return {
        error: false,
        data: data as T
      }
    }
    if (data?.message) {
      console.error(data?.message)
    }
    return {
      error: true,
      data: null,
      message: data?.message ?? statusText
    }
  } catch (error) {
    console.error(error)
    return {
      error: true,
      data: null,
      // @ts-ignore
      message: error?.message || '发生错误'
    }
  }
}
