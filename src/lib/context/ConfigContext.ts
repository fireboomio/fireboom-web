import { createContext, useContext } from 'react'

import type { AppRuntime } from '@/interfaces/base'
import type { ApiDocuments } from '@/services/a2s.namespace'

// export type SystemConfigType = {
//   apiPublicAddr: string
//   apiInternalAddr: string
//   apiListenHost: string
//   apiListenPort: string
//   hooksServerURL: string
//   hooksServerLanguage: string
//   debugEnabled: boolean
//   isDev: boolean
//   forcedJumpEnabled: boolean
//   logLevel: string
//   usageReport: boolean
// }
// export type EnvType = {}
// export type VersionType = {
//   copyright: string
//   prismaEngineVersion: string
//   prismaVersion: string
//   versionNum: string
// }

type SystemConfigContext = {
  // system: SystemConfigType
  // environment?: EnvType
  // version?: VersionType
  appRuntime: AppRuntime
  globalSetting: ApiDocuments.GlobalSetting & FBVersion
  setVersion: (ver: FBVersion) => void
  updateGlobalSetting: (globalSetting: Partial<ApiDocuments.GlobalSetting>) => Promise<void>
  refreshConfig: () => Promise<void>
}

export interface FBVersion {
  fbVersion: string
  fbCommit: string
}

export const ConfigContext = createContext<SystemConfigContext>({} as SystemConfigContext)

export function useConfigContext(): SystemConfigContext {
  return useContext(ConfigContext)
}
