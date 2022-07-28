import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { StorageResp, StorageAction } from '@/interfaces/storage'

interface storageCurrFileContextT {
  currFSId: number | null | undefined
  setCurrFSId: useImmer.Updater<number | null | undefined>
}
interface FSToggleContext {
  handleToggleDesigner: (value: 'content' | 'setEdit' | 'setCheck', id: number) => void
}
export const FSContext = createContext<StorageResp[]>([])
export const FSDispatchContext = createContext({} as Dispatch<StorageAction>)
export const FSCurrFileContext = createContext({} as storageCurrFileContextT)
export const FSToggleContext = createContext({} as FSToggleContext)
