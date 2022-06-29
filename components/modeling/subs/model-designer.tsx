import type { Entity } from '@/interfaces'

interface Props {
  content: Entity
}

export default function ModelDesigner({ content }: Props) {
  return <div>{JSON.stringify(content)}</div>
}
