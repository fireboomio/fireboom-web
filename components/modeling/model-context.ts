import type { Block } from '@mrleebo/prisma-ast'
import { createContext } from 'react'
import * as useImmer from 'use-immer'

interface EntitiesContextT {
  entities: Block[]
  setEntities: useImmer.Updater<Block[]>
}

export const EntitiesContext = createContext({} as EntitiesContextT)
