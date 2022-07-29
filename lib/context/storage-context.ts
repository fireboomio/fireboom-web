import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { StorageResp, StorageAction } from '@/interfaces/storage'

interface StorageCurrFileContextT {
  currId?: number
  setCurrId: useImmer.Updater<number | undefined>
}

interface StorageSwitchContextT {
  handleSwitch: (id: number, value: 'explorer' | 'editor' | 'viewer') => void
}

export const StorageContext = createContext<StorageResp[]>([])
export const StorageDispatchContext = createContext({} as Dispatch<StorageAction>)
export const StorageCurrFileContext = createContext({} as StorageCurrFileContextT)
export const StorageSwitchContext = createContext({} as StorageSwitchContextT)
