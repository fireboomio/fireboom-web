import { createContext } from 'react'
import * as useImmer from 'use-immer'

import { Entity } from '@/interfaces/modeling'

interface DatasourceContextT {
  DatasourceList: Entity[]
  setDatasourceList: useImmer.Updater<Entity[]>
}

export const DatasourceContext = createContext({} as DatasourceContextT)
