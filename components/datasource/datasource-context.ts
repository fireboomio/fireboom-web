import { createContext } from 'react'
import * as useImmer from 'use-immer'

import type { Entity } from '@/interfaces'

interface DatasourceContextT {
  DatasourceList: Entity[]
  setDatasourceList: useImmer.Updater<Entity[]>
}

export const DatasourceContext = createContext({} as DatasourceContextT)
