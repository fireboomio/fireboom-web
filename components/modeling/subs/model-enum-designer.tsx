import type { Entity } from '@/interfaces'

interface Props {
  content: Entity
}

export default function ModelEnumDesigner({ content }: Props) {
  return <div>{JSON.stringify(content)}</div>
}
