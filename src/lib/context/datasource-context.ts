import type { Dispatch } from 'react'
import { createContext } from 'react'
import type * as useImmer from 'use-immer'

import type { DatasourceAction, DatasourceResp, ShowType } from '@/interfaces/datasource'

interface DatasourceCurrDBContextT {
  currDBId: number | null | undefined
  setCurrDBId: useImmer.Updater<number | null | undefined>
}
interface DatasourceToggleContext {
  handleToggleDesigner: (type: ShowType, id?: number, sourceType?: number) => void
  handleSave: (content: DatasourceResp) => void
  handleCreate: (content: DatasourceResp) => void

  showType: ShowType
  content: DatasourceResp | undefined
}
export const DatasourceContext = createContext([] as DatasourceResp[])
export const DatasourceDispatchContext = createContext({} as Dispatch<DatasourceAction>)
export const DatasourceCurrDBContext = createContext({} as DatasourceCurrDBContextT)
export const DatasourceToggleContext = createContext({} as DatasourceToggleContext)
