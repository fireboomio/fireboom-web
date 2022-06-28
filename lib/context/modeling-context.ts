import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { Block, BlockAction, Entity } from '@/interfaces'

interface ModelingCurrEntityContextT {
  currEntityId: number | null | undefined
  setCurrEntityId: useImmer.Updater<number | null | undefined>
}

export const ModelingContext = createContext([] as Block[])
export const ModelingDispatchContext = createContext({} as Dispatch<BlockAction>)
export const ModelingCurrEntityContext = createContext({} as ModelingCurrEntityContextT)

interface EnumEntitiesContextT {
  enumEntities: Entity[]
  setEnumEntities: useImmer.Updater<Entity[]>
}

export const EnumEntitiesContext = createContext({} as EnumEntitiesContextT)
