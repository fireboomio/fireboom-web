import { createContext } from 'react'

export type SystemConfigType = {
  debugSwitch: boolean
  devSwitch: boolean
  forcedJumpSwitch: boolean
  logLevel: string
  middlewarePort: string
  domain: string // api域名
  apiPort: string // api端口
}

type SystemConfigContext = {
  config: SystemConfigType
  refreshConfig: () => Promise<void>
}

export const ConfigContext = createContext<SystemConfigContext>({} as SystemConfigContext)
