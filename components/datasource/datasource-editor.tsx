import type { DatasourceItem } from '@/interfaces'

import DatasourceEditorHead from './subs/datasource-editor-head'
import DatasourceEditorMainCheck from './subs/datasource-editor-main-check'
// import DatasourceEditorMainEdit from './subs/datasource-editor-main-edit'
interface Props {
  content: DatasourceItem
}
export default function DatasourceEditor({ content }: Props) {
  return (
    <div className="pl-4 pr-10 mt-6">
      <DatasourceEditorHead />
      <DatasourceEditorMainCheck content={content} />
      {/* <DatasourceEditorMainEdit /> */}
    </div>
  )
}
