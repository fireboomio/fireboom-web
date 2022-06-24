import { createContext } from 'react'
import * as useImmer from 'use-immer'

import type { DatasourceItem } from '@/interfaces'

interface DatasourceContextT {
  DatasourceList: DatasourceItem[]
  setDatasourceList: useImmer.Updater<DatasourceItem[]>
}

export const DatasourceContext = createContext({} as DatasourceContextT)
