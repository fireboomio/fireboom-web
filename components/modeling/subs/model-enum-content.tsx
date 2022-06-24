import { useContext } from 'react'

import { EnumEntitiesContext } from '@/lib/context'

import ModelEnumItem from './model-enum-item'

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
