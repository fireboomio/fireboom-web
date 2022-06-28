import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces'
import { EnumEntitiesContext } from '@/lib/context'

import ModelDesignerTitle from './subs/model-designer-title'
import ModelEnumBreadcrumb from './subs/model-enum-breadcrumb'
import ModelEnumContent from './subs/model-enum-content'

export default function ModelEnum() {
  const [enumEntities, setEnumEntities] = useImmer([
    { id: 0, name: 'users', note: '用户', isEditing: false },
    { id: 1, name: 'acv', note: '用户', isEditing: false },
    { id: 2, name: 'gfd', note: '用户', isEditing: false },
  ] as Entity[])

  return (
    <div className="p-6">
      <EnumEntitiesContext.Provider value={{ enumEntities, setEnumEntities }}>
        <ModelDesignerTitle />
        <ModelEnumBreadcrumb />
        <ModelEnumContent />
      </EnumEntitiesContext.Provider>
    </div>
  )
}
