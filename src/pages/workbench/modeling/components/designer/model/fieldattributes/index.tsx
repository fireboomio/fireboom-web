import type { Attribute, Field } from '@mrleebo/prisma-ast'
import type { AttributeArgument } from '@mrleebo/prisma-ast/src/getSchema'
import { message } from 'antd'

import type { DBSourceType } from '@/interfaces/modeling'

import FieldAttributeCell from './field-attribute-cell'

interface Props {
  field: Field
  fields: Field[]
  dbSourceType: DBSourceType
  deleteFieldAttribute: (idx: number) => void
  deleteEmptyAttributes: () => void
  updateFieldAttribute: (idx: number, attr: Attribute) => void
}

const FieldAttributesCell = ({
  field,
  fields,
  deleteEmptyAttributes,
  deleteFieldAttribute,
  updateFieldAttribute
}: Props) => {
  const fieldAttributes = field?.attributes ?? []

  const handleAttrNameSelect = (idx: number) => (value: string) => {
    if (!value) {
      deleteEmptyAttributes()
      return
    }
    // 检查id字段是否已经被使用
    if (value === 'id' && fields.find(f => f.attributes?.find(attr => attr.name === 'id'))) {
      void message.error('每一个实体只能有一个主键！')
      deleteEmptyAttributes()
      return
    }
    const newAttr: Attribute = { ...fieldAttributes[idx], name: value }
    updateFieldAttribute(idx, newAttr)
  }

  const updateAttrArgs = (index: number) => (newArgs: AttributeArgument[]) => {
    const newAttr = { ...fieldAttributes[index], args: newArgs }
    updateFieldAttribute(index, newAttr)
  }

  const handleRemoveClick = (idx: number) => () => {
    deleteFieldAttribute(idx)
  }

  return (
    <div className="h-7 flex">
      {fieldAttributes
        .map(fAttr => {
          if (fAttr.group) {
            return {
              ...fAttr,
              name: `${fAttr.group}.${fAttr.name}`
            }
          }
          return fAttr
        })
        .map((attr, idx) => (
          <FieldAttributeCell
            key={idx}
            fieldAttribute={attr}
            field={field}
            fields={fields}
            updateAttrArgs={updateAttrArgs(idx)}
            handleRemoveClick={handleRemoveClick(idx)}
            handleAttrNameSelect={handleAttrNameSelect(idx)}
          />
        ))}
    </div>
  )
}

export default FieldAttributesCell
