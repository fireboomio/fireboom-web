import { createContext, Dispatch } from 'react'
import * as useImmer from 'use-immer'

import type { Block, BlockAction, Entity } from '@/interfaces'

interface ModelingFoucsContextT {
  foucsId: number | null | undefined
  setFoucsId: useImmer.Updater<number | null | undefined>
}

export const ModelingContext = createContext([] as Block[])
export const ModelingDispatchContext = createContext({} as Dispatch<BlockAction>)
export const ModelingFoucsContext = createContext({} as ModelingFoucsContextT)

interface EnumEntitiesContextT {
  enumEntities: Entity[]
  setEnumEntities: useImmer.Updater<Entity[]>
}

export const EnumEntitiesContext = createContext({} as EnumEntitiesContextT)
