/* eslint-disable */
import type { Method, RequestBody, RequestQuery } from './a2s.types'

/**
 * 将参数拆分为 query 和 body
 */
export function extract(
  method: Method,
  args: RequestQuery | RequestBody,
  queryList: string[],
  paramList: string[]
): {
  query: RequestQuery | null
  body: RequestBody | null
} {
  if (args && typeof args === 'object') {
    if (method.toUpperCase() === 'GET') {
      return {
        query: args as RequestQuery,
        body: null
      }
    }
    if (typeof globalThis !== 'undefined' && 'FormData' in globalThis && args instanceof FormData) {
      return {
        query: null,
        body: args as FormData
      }
    }
    const query: RequestQuery = {}
    const body: RequestBody = {}
    Object.keys(args).forEach(key => {
      if (queryList.includes(key)) {
        query[key] = (args as RequestQuery)[key]
      } else if (!paramList.includes(key)) {
        body[key] = (args as Exclude<RequestBody, FormData>)[key]
      }
    })
    return { query, body }
  }
  return { query: {}, body: {} }
}

/**
 * 路径参数插值
 */
export function replacePath(path: string, pathValueMap?: any) {
  return path
    .replace(/\/\{(\w+)}/g, (_, str) => {
      return `/${(pathValueMap as Record<string, string | number>)[str]}`
    })
    .replace(/\/:(\w+)/g, (_, str) => {
      return `/${(pathValueMap as Record<string, string | number>)[str]}`
    })
}
