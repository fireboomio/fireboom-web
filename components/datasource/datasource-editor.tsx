import DatasourceEditorHead from './subs/datasource-editor-head'
import DatasourceEditorMain from './subs/datasource-editor-main'
export default function DatasourceEditor() {
  return (
    <div className="pl-4 pr-10 mt-6">
      <DatasourceEditorHead />
      <DatasourceEditorMain />
    </div>
  )
}
