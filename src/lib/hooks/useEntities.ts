import { useContext } from 'react'

import type { Entity } from '@/interfaces/modeling'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'

type EntitiesContext = {
  entities: Entity[]
  getNextId: () => number
  getFirstEntity: () => Entity | undefined
  delMap: Record<string, boolean>
  editMap: Record<string, boolean>
  newMap: Record<string, boolean>
}

const useEntities = (): EntitiesContext => {
  const {
    state: { blocks, delMap, editMap, newMap }
  } = useContext(PrismaSchemaContext)
  const getNextId = () => Math.max(...blocks.map(b => b.id)) + 1
  return {
    entities: blocks.filter(b => ['enum', 'model'].includes(b.type)).map(e => e as Entity),
    delMap,
    editMap,
    newMap,
    getNextId,
    getFirstEntity: () => {
      return blocks.find(b => ['enum', 'model'].includes(b.type)) as Entity
    }
  }
}

export default useEntities
