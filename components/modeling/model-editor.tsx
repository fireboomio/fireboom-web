import ModelEditorBreadcrumb from './subs/model-editor-breadcrumb'
import ModelEditorContent from './subs/model-editor-content'
import ModelEditorTitle from './subs/model-editor-title'

export default function ModelEditor() {
  return (
    <div className="p-6">
      <ModelEditorTitle />
      <ModelEditorBreadcrumb />
      <ModelEditorContent />
    </div>
  )
}
