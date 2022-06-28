import type { Entity } from '@/interfaces'

interface Props {
  content: Entity
}

export default function ModelEditorContent({ content }: Props) {
  return <div>{JSON.stringify(content)}</div>
}
