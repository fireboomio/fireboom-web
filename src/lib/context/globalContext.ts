import { createContext } from 'react'

export interface GlobalContextType {
  vscode: {
    options: {
      visible: boolean
      currentPath: string
      config: { hasParam?: boolean }
    }
    hide: () => void
    show: (path?: string, options?: { hasParam?: boolean }) => void
    toggleHook: (flag: boolean, path: string, hasParam?: boolean) => Promise<void>
    checkHookExist: (path: string, hasParam?: boolean) => Promise<boolean>
  }
}

export const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType)
