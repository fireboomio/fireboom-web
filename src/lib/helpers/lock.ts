export function lockFunction<T>(
  fun: (...arg: any) => Promise<T>
): (...arg: any) => Promise<T | undefined> {
  // 解析options
  // 保存原始方法
  const originFun = fun
  // 锁变量
  let lock = false
  // 覆盖为带锁版本
  return async function (...arg) {
    // 执行中，忽略本次调用
    if (lock) {
      return
    }

    // 记录执行结果和执行过程中产生的异常
    let excuteResult, excuteError

    // 上锁
    lock = true

    // 执行原始方法
    try {
      excuteResult = await originFun(...arg)
    } catch (e) {
      excuteError = e
    }

    // 延迟解锁
    // if (delay) {
    //   await new Promise(resolve => setTimeout(resolve, delay))
    // }

    // 解锁
    lock = false

    // 如果原始方法执行时发生异常，则自动抛出
    if (excuteError) {
      throw excuteError
    }
    // 返回执行结果
    return excuteResult
  }
}
