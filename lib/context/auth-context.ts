import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { AuthProvItem, AuthAction } from '@/interfaces/auth'

interface AuthCurrContextT {
  currAuthProvItemId: number | null | undefined
  setCurrAuthProvItemId: useImmer.Updater<number | null | undefined>
}

interface AuthToggleContext {
  handleToggleDesigner: (type: 'edit' | 'setting' | 'identity' | 'role', id?: number) => void
}

export const AuthContext = createContext<AuthProvItem[]>([])
export const AuthDispatchContext = createContext({} as Dispatch<AuthAction>)
export const AuthCurrContext = createContext({} as AuthCurrContextT)
export const AuthToggleContext = createContext({} as AuthToggleContext)