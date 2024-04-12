
import { Observable } from 'rxjs'
import { getAuthKey } from '@/lib/fetchers'
import { IntrospectionQuery } from 'graphql'

export async function fetchSubscription(rec: Record<string, unknown>, controller: AbortController) {
  return new Observable(observer => {
    fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-FB-Authentication': getAuthKey() || ''
      },
      body: JSON.stringify(rec),
      signal: controller.signal
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // 处理响应流
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      // 递归处理数据
      function readData() {
        reader.read().then(({ done, value }) => {
          console.log('read', value)
          if (done) {
            console.log('Stream is complete')
            return
          }

          // 处理数据
          const messages = decoder.decode(value)
          observer.next({ data: JSON.parse(messages) })
          // 继续读取
          readData()
        })
      }

      readData()
    })
  })
}

export async function fetcher(rec: Record<string, unknown>, setSchema: (q: IntrospectionQuery) => void, autoComplete?: boolean) {
  try {
    const resp = await fetch(`/app/main/graphql${autoComplete? '?autoComplete' : ''}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-FB-Authentication': getAuthKey() || ''
      },
      body: JSON.stringify(rec)
    })
    if (autoComplete) {
      const ret = await resp.text()
      if (resp.ok) {
        return ret
      } else {
        return {
          error: ret
        }
      }
    }
    const res = await resp.json()
    // 避免重复请求，初始化后提交schema结果
    if (rec.operationName === 'IntrospectionQuery') {
      window.schema = res.data
      setSchema(res.data as IntrospectionQuery)
    }
    return res
  } catch (error) {
    console.error(error)
    return {
      error: (error as { message: string; stack: string })?.message || error
    }
  }
}