export interface Result<T> {
  code: number
  message: string
  result: T
}

export type Status = '已启动' | '已关闭' | '编译中' | '其他'
