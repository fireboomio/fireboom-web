import type { Entity } from '@/interfaces'

interface Props {
  entity: Entity
}

export default function ModelEnumDesigner({ entity }: Props) {
  return <div>{JSON.stringify(entity)}</div>
}
