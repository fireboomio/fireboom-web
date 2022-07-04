import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { FileStorageItem, FlieAction } from '@/interfaces/filestorage'

interface storageCurrFileContextT {
  currFSId: number | null | undefined
  setCurrFSId: useImmer.Updater<number | null | undefined>
}

export const FSContext = createContext<FileStorageItem[]>([])
export const FSDispatchContext = createContext({} as Dispatch<FlieAction>)
export const FSCurrFileContext = createContext({} as storageCurrFileContextT)
