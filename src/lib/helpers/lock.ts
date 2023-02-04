import { useCallback, useEffect, useRef, useState } from 'react'

export function useLock<T, Q extends (...arg: any) => Promise<T>>(
  fun: Q,
  deps: React.DependencyList
) {
  // console.log('createLock')
  // 解析options
  // 保存原始方法
  const originFun = useRef(fun)
  // 锁变量
  let lock = useRef(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    originFun.current = fun
    lock.current = false
  }, deps)
  // 覆盖为带锁版本
  const wrapped = useCallback(async function (...arg: Parameters<Q>) {
    // console.log('run lock', lock.current)
    // 执行中，忽略本次调用
    if (lock.current) {
      return
    }

    // 记录执行结果和执行过程中产生的异常
    let excuteResult, excuteError

    setLoading(true)
    // 上锁
    lock.current = true

    // 执行原始方法
    try {
      // @ts-ignore
      excuteResult = await originFun.current(...arg)
    } catch (e) {
      excuteError = e
    }

    // 延迟解锁
    // if (delay) {
    //   await new Promise(resolve => setTimeout(resolve, delay))
    // }

    setLoading(false)
    // 解锁
    lock.current = false

    // 如果原始方法执行时发生异常，则自动抛出
    if (excuteError) {
      throw excuteError
    }
    // 返回执行结果
    return excuteResult
  }, deps) as (...arg: Parameters<Q>) => Promise<Awaited<ReturnType<Q>> | undefined>
  return { loading, fun: wrapped }
}
