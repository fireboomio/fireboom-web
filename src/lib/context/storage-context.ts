import type { Dispatch } from 'react'
import { createContext } from 'react'
import type * as useImmer from 'use-immer'

import type { StorageAction } from '@/interfaces/storage'
import type { ApiDocuments } from '@/services/a2s.namespace'

interface StorageCurrFileContextT {
  currName?: string
  setCurrName: useImmer.Updater<string | undefined>
}

interface StorageSwitchContextT {
  handleSwitch: (value: 'explorer' | 'form' | 'detail', name: string | undefined) => void
}

export const StorageContext = createContext<ApiDocuments.Storage[]>([])
export const StorageDispatchContext = createContext({} as Dispatch<StorageAction>)
export const StorageCurrFileContext = createContext({} as StorageCurrFileContextT)
export const StorageSwitchContext = createContext({} as StorageSwitchContextT)
