import React from 'react'
import { useContext } from 'react'
import ModelEnumItem from './model-enum-item'
import { EnumEntitiesContext } from '../model-context'

export default function ModelEnumContent() {
  const { enumEntities } = useContext(EnumEntitiesContext)

  return (
    <div className="mt-5">
      {enumEntities.map((enumEntity) => (
        <ModelEnumItem key={enumEntity.id} enumEntity={enumEntity} />
      ))}
    </div>
  )
}
