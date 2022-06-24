import { createContext } from 'react'
import * as useImmer from 'use-immer'

import type { Entity } from '@/interfaces'

interface ModelingContextT {
  entities: Entity[]
  setEntities: useImmer.Updater<Entity[]>
}

export const ModelingContext = createContext({} as ModelingContextT)
