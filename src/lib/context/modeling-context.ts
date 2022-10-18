import type { Dispatch } from 'react'
import { createContext } from 'react'
import type * as useImmer from 'use-immer'

import type { Block, BlockAction } from '@/interfaces/modeling'

interface ModelingCurrEntityContextT {
  currEntityId: number | null
  setCurrEntityId: useImmer.Updater<number | null>
}

export const ModelingContext = createContext<Block[]>([])
export const ModelingDispatchContext = createContext({} as Dispatch<BlockAction>)
export const ModelingCurrEntityContext = createContext({} as ModelingCurrEntityContextT)
