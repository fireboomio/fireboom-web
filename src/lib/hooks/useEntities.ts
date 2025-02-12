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
  let entities = []
  let cur_entity, cur_entity_comment
  for (const block of blocks) {
    switch (block.type) {
      case "enum":
      case "model":
        cur_entity = block
        break
      case "comment":
        cur_entity_comment = block.text.replace(/^\/{3}\s*/, '')
        break
      case "break":
        if (cur_entity) {
          entities.push({
            ...cur_entity,
            comment: cur_entity_comment
          })
        }
        cur_entity = undefined
        cur_entity_comment = undefined
        break
    }
  }
  return {
    entities: entities,
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
