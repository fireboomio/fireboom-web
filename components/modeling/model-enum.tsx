import ModelEnumBreadcrumb from './subs/model-enum-breadcrumb'
import ModelEnumContent from './subs/model-enum-content'
import ModelEditorTitle from './subs/model-editor-title'
import { useImmer } from 'use-immer'
import { EnumEntity } from '@/interfaces/modeling'
import { EnumEntitiesContext } from './model-context'

export default function ModelEnum() {
  const [enumEntities, setEnumEntities] = useImmer([
    { id: 0, name: 'users', note: '用户', isEditing: false },
    { id: 1, name: 'acv', note: '用户', isEditing: false },
    { id: 2, name: 'gfd', note: '用户', isEditing: false },
  ] as EnumEntity[])
  return (
    <div className="p-6">
      <EnumEntitiesContext.Provider value={{ enumEntities, setEnumEntities }}>
        <ModelEditorTitle />
        <ModelEnumBreadcrumb />
        <ModelEnumContent />
      </EnumEntitiesContext.Provider>
    </div>
  )
}
