import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { StorageResp, StorageAction } from '@/interfaces/storage'

interface StorageCurrFileContextT {
  currId: number | null | undefined
  setCurrId: useImmer.Updater<number | null | undefined>
}

interface FSToggleContext {
  handleToggleDesigner: (value: 'explorer' | 'editor' | 'viewer', id: number) => void
}

export const StorageContext = createContext<StorageResp[]>([])
export const StorageDispatchContext = createContext({} as Dispatch<StorageAction>)
export const StorageCurrFileContext = createContext({} as StorageCurrFileContextT)
export const FSToggleContext = createContext({} as FSToggleContext)
