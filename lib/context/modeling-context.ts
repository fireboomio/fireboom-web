import { createContext } from 'react'
import * as useImmer from 'use-immer'

import type { Block, Entity } from '@/interfaces'

interface ModelingContextT {
  blocks: Block[]
  setBlocks: useImmer.Updater<Block[]>
}

export const ModelingContext = createContext({} as ModelingContextT)

interface EnumEntitiesContextT {
  enumEntities: Entity[]
  setEnumEntities: useImmer.Updater<Entity[]>
}

export const EnumEntitiesContext = createContext({} as EnumEntitiesContextT)
