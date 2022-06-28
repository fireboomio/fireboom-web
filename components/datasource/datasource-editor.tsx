import DatasourceEditorHead from './subs/datasource-editor-head'
// import DatasourceEditorMainCheck from './subs/datasource-editor-main-check'
import DatasourceEditorMainEdit from './subs/datasource-editor-main-edit'

export default function DatasourceEditor() {
  return (
    <div className="pl-4 pr-10 mt-6">
      <DatasourceEditorHead />
      {/* <DatasourceEditorMainCheck /> */}
      <DatasourceEditorMainEdit />
    </div>
  )
}
