import { createContext } from 'react'
import * as useImmer from 'use-immer'

import type { Entity } from '@/interfaces'
import { EnumEntity } from '@/interfaces/modeling'

interface ModelingContextT {
  entities: Entity[]
  setEntities: useImmer.Updater<Entity[]>
}

export const ModelingContext = createContext({} as ModelingContextT)
interface EnumEntitiesContext {
  enumEntities: EnumEntity[]
  setEnumEntities: useImmer.Updater<EnumEntity[]>
}

export const EnumEntitiesContext = createContext({} as EnumEntitiesContext)
