import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { StorageResp, StorageAction } from '@/interfaces/storage'

interface StorageCurrFileContextT {
  currId?: number
  setCurrId: useImmer.Updater<number | undefined>
}

interface StorageSwitchContextT {
  handleSwitch: (value: 'explorer' | 'form' | 'detail', id: number | undefined) => void
}

export const StorageContext = createContext<StorageResp[]>([])
export const StorageDispatchContext = createContext({} as Dispatch<StorageAction>)
export const StorageCurrFileContext = createContext({} as StorageCurrFileContextT)
export const StorageSwitchContext = createContext({} as StorageSwitchContextT)
