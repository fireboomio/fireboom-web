import { Entity } from '@/interfaces'

import ModelEditorBreadcrumb from './subs/model-editor-breadcrumb'
import ModelEditorContent from './subs/model-editor-content'
import ModelEditorTitle from './subs/model-editor-title'

interface Props {
  content: Entity
}

export default function ModelEditor({ content }: Props) {
  return (
    <div className="p-6">
      <ModelEditorTitle />
      <ModelEditorBreadcrumb />
      <ModelEditorContent content={content} />
    </div>
  )
}
