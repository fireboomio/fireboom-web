import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { Block, BlockAction } from '@/interfaces'

interface ModelingCurrEntityContextT {
  currEntityId: number | null | undefined
  setCurrEntityId: useImmer.Updater<number | null | undefined>
}

export const ModelingContext = createContext<Block[]>([])
export const ModelingDispatchContext = createContext({} as Dispatch<BlockAction>)
export const ModelingCurrEntityContext = createContext({} as ModelingCurrEntityContextT)
