import { useCallback, useEffect, useRef } from 'react'

export function useLock<T>(
  fun: (...arg: any) => Promise<T>,
  deps: any
): (...arg: any) => Promise<T | undefined> {
  console.log('createLock')
  // 解析options
  // 保存原始方法
  const originFun = useRef(fun)
  // 锁变量
  let lock = useRef(false)
  useEffect(() => {
    originFun.current = fun
    lock.current = false
  }, deps)
  // 覆盖为带锁版本
  return useCallback(async function (...arg) {
    console.log('run lock', lock.current)
    // 执行中，忽略本次调用
    if (lock.current) {
      return
    }

    // 记录执行结果和执行过程中产生的异常
    let excuteResult, excuteError

    // 上锁
    lock.current = true

    // 执行原始方法
    try {
      excuteResult = await originFun.current(...arg)
    } catch (e) {
      excuteError = e
    }

    // 延迟解锁
    // if (delay) {
    //   await new Promise(resolve => setTimeout(resolve, delay))
    // }

    // 解锁
    lock.current = false

    // 如果原始方法执行时发生异常，则自动抛出
    if (excuteError) {
      throw excuteError
    }
    // 返回执行结果
    return excuteResult
  }, deps)
}
