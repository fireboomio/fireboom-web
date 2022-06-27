import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { Block, BlockAction, Entity } from '@/interfaces'

export const ModelingContext = createContext([] as Block[])
export const ModelingDispatchContext = createContext({} as Dispatch<BlockAction>)

interface EnumEntitiesContextT {
  enumEntities: Entity[]
  setEnumEntities: useImmer.Updater<Entity[]>
}

export const EnumEntitiesContext = createContext({} as EnumEntitiesContextT)
