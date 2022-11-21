import type { AxiosResponse } from 'axios'

export interface Result<T> {
  code: number
  message: string
  result: T
}

export interface Action<T> {
  type: string
  payload: T
}

export type EngineStatus = '已启动' | '已关闭' | '编译中' | '--'

export interface ErrorInfo {
  warnTotal: number
  errTotal: number
}

export interface Info {
  errorInfo: ErrorInfo
  engineStatus: EngineStatus
  startTime: string
  hookStatus: string
}

export interface WithClassNames {
  classNames?: string
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

declare module 'axios' {
  export interface AxiosRequestConfig {
    resolveErrorMsg?: (response?: AxiosResponse) => string
  }
}
declare module '@paljs/types' {
  export interface Field {
    hasDefault: boolean
  }
}
