import { useContext } from 'react'

import type { Entity } from '@/interfaces/modeling'
import { updateCurrentEntityIdAction } from '@/lib/actions/PrismaSchemaActions'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'

const useCurrentEntity = () => {
  const {
    state: { currentEntityId, blocks },
    dispatch
  } = useContext(PrismaSchemaContext)

  let currentEntity = blocks.find(b => b.id === currentEntityId) as Entity
  if (currentEntity) {
    const currentEntityIndex = blocks.findIndex(b => b.id === currentEntityId)
    let finished = false
    for (let i = currentEntityIndex-1; i >=0 ; i--) {
      const block = blocks[i]
      switch (block.type) {
        case "datasource":
        case "enum":
        case "model":
        case "generator":
          finished = true
          break;
        case "comment":
          finished = true
          currentEntity = {...currentEntity, comment: block.text}
          break
      }
      if (finished) {
        break
      }
    }
  }

  const changeToEntityById = (entityId: number) => {
    const exist = blocks.find(b => b.id === entityId)
    const entities = blocks.filter(b => ['enum', 'model'].includes(b.type))
    const firstEntityId = entities.length > 0 ? entities[0].id : 0
    dispatch(updateCurrentEntityIdAction(exist ? entityId : firstEntityId))
  }

  return {
    currentEntityId,
    currentEntity,
    changeToEntityById
  }
}

export default useCurrentEntity
