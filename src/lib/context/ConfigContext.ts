import { createContext, useContext } from 'react'

export type SystemConfigType = {
  apiPublicAddr: string
  apiInternalAddr: string
  apiListenHost: string
  apiListenPort: string
  hooksServerURL: string
  debugEnabled: boolean
  isDev: boolean
  forcedJumpEnabled: boolean
  logLevel: string
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
