import { createContext } from 'react'

import type { Info } from '@/interfaces/common'

export interface GlobalContextType {
  info: Info
  isCompiling: boolean
  vscode: {
    options: {
      visible: boolean
      currentPath: string
      config: { hasParam?: boolean }
    }
    hide: () => void
    show: (path?: string, options?: { hasParam?: boolean }) => void
    toggleOperationHook: (
      flag: boolean,
      hookPath: string,
      operationName: string,
      hasParam?: boolean
    ) => Promise<void>
    isHookServerSelected: boolean
    checkHookExist: (path: string, hasParam?: boolean, skipConfirm?: boolean) => Promise<boolean>
  }
}

export const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType)
