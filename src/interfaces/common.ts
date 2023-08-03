import type { AxiosResponse } from 'axios'

import type { HookStatus, ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

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
  errorInfo: { errTotal: number; warnTotal: number }
  engineStartTime: string
  engineStatus: ServiceStatus
  globalStartTime: string
  hookStatus: boolean
  fbVersion?: string
  fbCommit?: string
}

export interface WithClassNames {
  classNames?: string
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

declare module 'axios' {
  export interface AxiosRequestConfig {
    resolveErrorMsg?: (response?: AxiosResponse) => string
    onError?: (result: { code: string; msg: string; result: any }) => void
  }
}
declare module '@paljs/types' {
  export interface Field {
    hasDefault: boolean
  }
}

export enum VariableKind {
  Static = 0,
  Env = 1
}
