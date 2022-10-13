import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { DatasourceResp, DatasourceAction, ShowType } from '@/interfaces/datasource'

interface DatasourceCurrDBContextT {
  currDBId: number | null | undefined
  setCurrDBId: useImmer.Updater<number | null | undefined>
}
interface DatasourceToggleContext {
  handleToggleDesigner: (type: ShowType, id?: number, sourceType?: number) => void
  handleSave: (content: DatasourceResp) => void
  handleCreate: (content: DatasourceResp) => void
}
export const DatasourceContext = createContext([] as DatasourceResp[])
export const DatasourceDispatchContext = createContext({} as Dispatch<DatasourceAction>)
export const DatasourceCurrDBContext = createContext({} as DatasourceCurrDBContextT)
export const DatasourceToggleContext = createContext({} as DatasourceToggleContext)
