import type { APIDesc } from '../../store'

export type BaseHookState = {
  name: string
  enabled: boolean
  path: string
}

export type NormalGlobalHookState = {
  onRequest: HookState
  onResponse: HookState
}

export type SubscriptionGlobalHookState = {
  onConnectionInit: HookState
}

export type HookState = BaseHookState & {
  can?: boolean
}

export type CommonChartProps = {
  hookState: {
    preResolve: HookState
    mutatingPreResolve: HookState
    customResolve: HookState
    postResolve: HookState
    mutatingPostResolve: HookState
    mockResolve: HookState
  }
  directiveState: {
    isInternal: boolean
    fromClaim: boolean
    rbac: boolean
    jsonSchema: boolean
    injectGeneratedUUID: boolean
    injectCurrentDatetime: boolean
    injectEnvironmentVariable: boolean
    transform: boolean
  }
  apiSetting: APIDesc['setting']
  onEditHook?: (hook: BaseHookState) => void
}
