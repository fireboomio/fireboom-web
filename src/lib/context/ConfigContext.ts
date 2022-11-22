import { createContext, useContext } from 'react'

export type SystemConfigType = {
  debugSwitch: boolean
  devSwitch: boolean
  forcedJumpSwitch: boolean
  logLevel: string
  middlewarePort: string
  apiHost: string
  apiPort: string
  oidcHost: string
  oidcPort: string
}

type SystemConfigContext = {
  config: SystemConfigType
  refreshConfig: () => Promise<void>
}

export const ConfigContext = createContext<SystemConfigContext>({} as SystemConfigContext)

export function useConfigContext(): SystemConfigContext {
  return useContext(ConfigContext)
}
