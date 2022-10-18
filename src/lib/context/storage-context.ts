import type { Dispatch } from 'react'
import { createContext } from 'react'
import type * as useImmer from 'use-immer'

import type { StorageAction, StorageResp } from '@/interfaces/storage'

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
