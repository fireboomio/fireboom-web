import { ApiDocuments } from "@/services/a2s.namespace"

export type BaseHookState = {
  name: string
  enabled: boolean
  path: string
}

export type NormalGlobalHookState = {
  beforeRequest: HookState
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
  apiDesc: ApiDocuments.Operation
  onEditHook?: (hook: BaseHookState) => void
  onToggleHook?: (hook: BaseHookState, flag: boolean) => void
}
