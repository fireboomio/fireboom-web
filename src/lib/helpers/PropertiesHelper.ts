import type { Field, Comment, Property, Break } from '@mrleebo/prisma-ast'

import AttributeArgHelper from '@/components/PrismaDesign/components/AttributeArg/AttributeArgHelper'
import type { Model } from '@/interfaces/modeling'

export const checkAndUpdateRelation = (
  model: Model,
  toBeUpdatedField: Field,
  newFieldName?: string
) => {
  const { name: fieldName } = toBeUpdatedField
  const properties: Array<Property | Comment | Break> = []
  for (let prop of model.properties) {
    if (prop.type === 'field') {
      if (prop.comment) {
        properties.push({type: 'comment', text: prop.comment})
      }
      const newAttributes = prop.attributes?.map(attr => {
        if (attr.name === 'relation') {
          const { name, fields, references } = AttributeArgHelper.extractRelationAttributeArgs(
              attr.args ?? []
          )
          if (fields.includes(fieldName)) {
            const idx = fields.indexOf(fieldName)
            const newFields = [...fields]
            newFieldName ? (newFields[idx] = newFieldName) : newFields.splice(idx, 1)
            const newAttrArgs = AttributeArgHelper.buildNewRelationArgs(
                name,
                newFields,
                references
            )
            return {
              ...attr,
              args: newAttrArgs
            }
          }
        }
        return attr
      })
      prop = {
        ...prop,
        comment: undefined,
        attributes: newAttributes
      }
    }
    properties.push(prop)
  }
  return {
    ...model,
    properties: properties
  }
}

export const checkIdExist = (model: Model) => {
  return !!model.properties.find(p => {
    if (p.type === 'field') {
      return p.attributes?.find(
        attr => attr.name === 'id' || (attr.name === 'unique' && !p.optional)
      )
    }
    if (p.type === 'attribute') {
      return p.name === 'id' || p.name === 'unique'
    }
    return false
  })
}
