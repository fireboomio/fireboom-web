import type { Field } from '@mrleebo/prisma-ast'

import type { Enum, Model } from '@/interfaces/modeling'
import { PRISMA_BASE_TYPES } from '@/lib/constants/prismaConstants'
import useEntities from '@/lib/hooks/useEntities'
import FieldTypeSelector from '@/pages/workbench/modeling/components/FieldType/FieldTypeSelector'

interface Props {
  index: number
  field: Field
  fields: Field[]
  currentModel: Model
  updateFieldType: (fieldType: string) => void
  addNewEnum: (newEnum: Enum) => void
  newEnums: Enum[]
}

const FieldTypeCell = ({ field, updateFieldType, currentModel, addNewEnum, newEnums }: Props) => {
  const { entities } = useEntities()
  const relationFieldTypes = entities.filter(e => e.id !== currentModel.id).map(e => e.name)

  const newEnumsNames = newEnums.map(e => e.name)
  const fieldTypes = [...PRISMA_BASE_TYPES, ...relationFieldTypes, ...newEnumsNames]

  const fieldTypeSelectorOptions = fieldTypes.map(type => {
    return {
      label: type,
      value: type
    }
  })

  const handleTypeSelect = (fieldType: string | string[]) => {
    updateFieldType(fieldType as string)
  }

  // 处理fieldType为 Unsupported 或者其他function类型
  const currentFieldType =
    typeof field.fieldType === 'string'
      ? field.fieldType
      : `${field.fieldType.name}(${field.fieldType.params.join(',')})`

  return (
    <div className="h-6 mr-3 cursor-pointer">
      <FieldTypeSelector
        options={fieldTypeSelectorOptions}
        isArray={field.array ?? false}
        isOptional={field.optional ?? false}
        selectedValue={currentFieldType}
        addNewEnum={addNewEnum}
        handleDataChange={handleTypeSelect}
      />
    </div>
  )
}

export default FieldTypeCell
