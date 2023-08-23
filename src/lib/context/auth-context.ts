import type { Dispatch } from 'react'
import { createContext } from 'react'
import type * as useImmer from 'use-immer'

import type { AuthAction, User } from '@/interfaces/auth'
import type { Action } from '@/interfaces/common'
import type { Connector } from '@/interfaces/connector'
import type { ApiDocuments } from '@/services/a2s.namespace'

interface AuthCurrContextT {
  currAuthProvItemName: number | null | undefined
  setCurrAuthProvItemName: useImmer.Updater<number | null | undefined>
}

interface AuthToggleContextState {
  handleBottomToggleDesigner: (type: 'data' | 'edit', name?: string) => void
}
interface AuthUserCurrContextT {
  authUserCurr: User
  setAuthUserCurr: useImmer.Updater<User>
}

export interface ConnectorContextType {
  connector: {
    currentConnector: Connector
    connectors: Connector[]
  }
  connectorDispatch: React.Dispatch<Action<unknown>>
}

export const AuthContext = createContext<ApiDocuments.Authentication[]>([])
export const AuthDispatchContext = createContext({} as Dispatch<AuthAction>)
export const AuthCurrContext = createContext({} as AuthCurrContextT)
export const AuthToggleContext = createContext({} as AuthToggleContextState)
export const ConnectorContext = createContext({} as ConnectorContextType)

export const AuthUserCurrContext = createContext<AuthUserCurrContextT>({} as AuthUserCurrContextT)
