import type { Entity } from '@/interfaces/modeling'

interface Props {
  entity: Entity
}

export default function ModelEnumDesigner({ entity }: Props) {
  return <div>{JSON.stringify(entity)}</div>
}
