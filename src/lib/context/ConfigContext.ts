import { createContext, useContext } from 'react'

export type SystemConfigType = {
  debugSwitch: boolean
  devSwitch: boolean
  forcedJumpSwitch: boolean
  logLevel: string
  middlewarePort: string
  apiAddr: string
  oidcHost: string
  oidcPort: string
  hooksServerURL: string
  usageReport: boolean
}

type SystemConfigContext = {
  config: SystemConfigType
  refreshConfig: () => Promise<void>
}

export const ConfigContext = createContext<SystemConfigContext>({} as SystemConfigContext)

export function useConfigContext(): SystemConfigContext {
  return useContext(ConfigContext)
}
