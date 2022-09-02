export interface Result<T> {
  code: number
  message: string
  result: T
}

export type EngineStatus = '已启动' | '已关闭' | '编译中' | '--'

export interface ErrorInfo {
  warnTotal: number
  errTotal: number
}

export interface Info {
  errorInfo: ErrorInfo
  engineStatus: EngineStatus
  hookStatus: string
}
