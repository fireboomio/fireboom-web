import ModelEditorContent from './subs/model-editor-content'

import ModelEditorBreadcrumb from './subs/model-editor-breadcrumb'

import ModelEditorTitle from './subs/model-editor-title'
export default function ModelEditor() {
  return (
    <>
      <ModelEditorTitle></ModelEditorTitle>
      <ModelEditorBreadcrumb></ModelEditorBreadcrumb>
      <ModelEditorContent></ModelEditorContent>
    </>
  )
}
