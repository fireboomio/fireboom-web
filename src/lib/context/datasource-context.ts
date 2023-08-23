import type { Dispatch } from 'react'
import { createContext } from 'react'
import type * as useImmer from 'use-immer'

import type { DatasourceAction, ShowType } from '@/interfaces/datasource'
import type { ApiDocuments } from '@/services/a2s.namespace'

interface DatasourceCurrDBContextT {
  currDBId: number | null | undefined
  setCurrDBId: useImmer.Updater<number | null | undefined>
}
interface DatasourceToggleContext {
  handleToggleDesigner: (type: ShowType, id?: number, sourceType?: number) => void
  handleSave: (content: Partial<ApiDocuments.Datasource>) => void
  handleCreate: (content: ApiDocuments.Datasource) => void

  showType: ShowType
  content: ApiDocuments.Datasource | undefined
}
export const DatasourceContext = createContext([] as ApiDocuments.Datasource[])
export const DatasourceDispatchContext = createContext({} as Dispatch<DatasourceAction>)
export const DatasourceCurrDBContext = createContext({} as DatasourceCurrDBContextT)
export const DatasourceToggleContext = createContext({} as DatasourceToggleContext)
