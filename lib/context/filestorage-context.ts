import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { FileStorageResp, FlieAction } from '@/interfaces/filestorage'

interface storageCurrFileContextT {
  currFSId: number | null | undefined
  setCurrFSId: useImmer.Updater<number | null | undefined>
}
interface FSToggleContext {
  handleToggleDesigner: (value: 'content' | 'setEdit' | 'setCheck', id: number) => void
}
export const FSContext = createContext<FileStorageResp[]>([])
export const FSDispatchContext = createContext({} as Dispatch<FlieAction>)
export const FSCurrFileContext = createContext({} as storageCurrFileContextT)
export const FSToggleContext = createContext({} as FSToggleContext)
