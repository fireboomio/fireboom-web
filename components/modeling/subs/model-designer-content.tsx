import type { Entity } from '@/interfaces'

interface Props {
  content: Entity
}

export default function ModelDesignerContent({ content }: Props) {
  return <div>{JSON.stringify(content)}</div>
}
