import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { AuthProvResp, AuthAction, User } from '@/interfaces/auth'
import { Action } from '@/interfaces/common'
import { Connector } from '@/interfaces/connector'

interface AuthCurrContextT {
  currAuthProvItemId: number | null | undefined
  setCurrAuthProvItemId: useImmer.Updater<number | null | undefined>
}

interface AuthToggleContext {
  handleBottomToggleDesigner: (type: 'data' | 'edit', id?: number) => void
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

export const AuthContext = createContext<AuthProvResp[]>([])
export const AuthDispatchContext = createContext({} as Dispatch<AuthAction>)
export const AuthCurrContext = createContext({} as AuthCurrContextT)
export const AuthToggleContext = createContext({} as AuthToggleContext)
export const ConnectorContext = createContext({} as ConnectorContextType)

export const AuthUserCurrContext = createContext<AuthUserCurrContextT>({} as AuthUserCurrContextT)