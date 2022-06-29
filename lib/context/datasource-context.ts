import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { DatasourceItem, DatasourceAction } from '@/interfaces'

interface DatasourceCurrDBContextT {
  currDBId: number | null | undefined
  setCurrDBId: useImmer.Updater<number | null | undefined>
}

export const DatasourceContext = createContext([] as DatasourceItem[])
export const DatasourceDispatchContext = createContext({} as Dispatch<DatasourceAction>)
export const DatasourceCurrDBContext = createContext({} as DatasourceCurrDBContextT)
