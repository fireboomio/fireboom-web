import { createContext } from 'react'
import * as useImmer from 'use-immer'

import { Entity } from '@/interfaces/modeling'

interface EntitiesContextT {
  entities: Entity[]
  setEntities: useImmer.Updater<Entity[]>
}

export const EntitiesContext = createContext({} as EntitiesContextT)
