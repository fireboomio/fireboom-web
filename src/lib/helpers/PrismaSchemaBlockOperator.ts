import type { Attribute, Field, KeyValue, RelationArray } from '@mrleebo/prisma-ast'

import AttributeArgHelper from '@/components/PrismaDesign/components/AttributeArg/AttributeArgHelper'
import type { Block, Entity, Enum, Model } from '@/interfaces/modeling'

/**
 * 检查被编辑的model中的relation的相应字段是否标记有unique，代表一对一关系，需要在对应关联的model中增加关联字段
 * 并且对应model中的关联字段非数组且是optional的
 */
const checkIfRelationIsUnique = (field: Field, model: Model): boolean => {
  const fieldRelationAttr = field.attributes?.find(attr => attr.name === 'relation')
  const relationAttrFields =
    fieldRelationAttr?.args
      ?.map(attrArg => attrArg.value as KeyValue)
      .filter(value => value.key === 'fields')
      .map(value => value.value as RelationArray)
      .flatMap(array => array.args) ?? []
  const fieldWithUniqueAttr = model.properties
    .filter(p => p.type === 'field')
    .map(f => f as Field)
    .filter(f => relationAttrFields.includes(f.name))
    .find(f => f.attributes?.find(attr => attr.name === 'unique'))
  return !!fieldWithUniqueAttr
}

const checkAndUpdateRelationField = (updatedModel: Model, blocks: Block[]): Block[] => {
  const newBlocks = [...blocks]
  // 当前表的关联字段
  const relationFields = updatedModel.properties
    .filter(p => p.type === 'field')
    .map(f => f as Field)
    .filter(f => f.attributes?.find(attr => attr.name === 'relation'))
  // 遍历每一个关联字段，修改对应关联实体的关联属性
  relationFields.forEach(relationField => {
    const fieldType = relationField.fieldType as string
    const { name: relationDisambiguateName } = AttributeArgHelper.extractRelationAttributeArgs(
      relationField.attributes?.find(attr => attr.name === 'relation')?.args ?? []
    )
    // 查找出对应关联实体
    const relationModel = newBlocks
      .filter(b => b.type === 'model')
      .map(m => m as Model)
      .find(m => m.name === fieldType)
    if (relationModel) {
      // check 是否关联字段设置一对一
      const isUnique = checkIfRelationIsUnique(relationField, updatedModel)
      // 如果对应关联表尚未添加关联字段，就加入newRelationModelRelationField
      let foundRelationModelRelationFields = false
      const newProperties = relationModel.properties.map(p => {
        if (p.type === 'field' && p.fieldType === updatedModel.name) {
          if (relationDisambiguateName) {
            const { name: relationModelFieldDisambiguateName } =
              AttributeArgHelper.extractRelationAttributeArgs(
                p.attributes?.find(attr => attr.name === 'relation')?.args ?? []
              )
            if (relationModelFieldDisambiguateName !== relationDisambiguateName) {
              return p
            }
          }
          foundRelationModelRelationFields = true
          // 找到关联字段就更新array 和 optional
          return {
            ...p,
            array: !isUnique,
            optional: isUnique
          }
        }
        return p
      })
      // 没有找到关联字段就新增
      if (!foundRelationModelRelationFields) {
        const relationAttr: Attribute = {
          type: 'attribute',
          kind: 'field',
          name: 'relation',
          args: AttributeArgHelper.buildNewRelationArgs(relationDisambiguateName, [], [])
        }
        newProperties.push({
          type: 'field',
          name: relationDisambiguateName
            ? relationDisambiguateName.replaceAll('"', '').toLowerCase()
            : `${updatedModel.name.toLowerCase()}${isUnique ? '' : 's'}`,
          fieldType: updatedModel.name,
          array: !isUnique,
          optional: isUnique,
          attributes: relationDisambiguateName ? [relationAttr] : []
        })
      }
      newBlocks.forEach((b, idx) => {
        if (b.id === relationModel.id) {
          newBlocks[idx] = {
            ...relationModel,
            properties: newProperties
          }
        }
      })
    }
  })
  return newBlocks
}

const deleteRelations = (
  tobeDeletedRelationModels: Field[],
  editingModel: string,
  blocks: Block[]
) => {
  const tobeDeletedRelationModelName = tobeDeletedRelationModels.map(f => f.fieldType)
  const tobeDeletedRelationName = tobeDeletedRelationModels
    .map(f =>
      AttributeArgHelper.extractRelationAttributeArgs(
        f.attributes?.find(attr => attr.name === 'relation')?.args ?? []
      )
    )
    .map(item => item.name)
  return blocks.map(b => {
    if (b.type === 'model' && tobeDeletedRelationModelName.includes(b.name)) {
      const newModel: Model = { ...b }
      return {
        ...newModel,
        // 删除这个model中类型为当前编辑的model的字段
        properties: newModel.properties.filter(p => {
          if (p.type === 'field' && p.fieldType === editingModel) {
            const { name } = AttributeArgHelper.extractRelationAttributeArgs(
              p.attributes?.find(attr => attr.name === 'relation')?.args ?? []
            )
            // 如果找到 返回false， 把这个字段删除
            return !tobeDeletedRelationName.includes(name)
          }
          return true
        })
      }
    }
    return b
  })
}

const PrismaSchemaBlockOperator = (blocks: Block[]) => ({
  addModel: (newModel: Model): Block[] => {
    const newBlocks = [...blocks, newModel]
    return checkAndUpdateRelationField(newModel, newBlocks)
  },
  updateModel: (model: Model): Block[] => {
    const originalModel = blocks.find(b => b.id === model.id) as Model
    const originalRelationFields = originalModel?.properties
      .filter(p => p.type === 'field' && p.attributes?.find(attr => attr.name === 'relation'))
      .map(f => f as Field)
    const currentRelationFields = model.properties
      .filter(p => p.type === 'field' && p.attributes?.find(attr => attr.name === 'relation'))
      .map(f => f as Field)

    // 需要把其他model中相应的relation也删除掉
    const tobeDeletedRelationFromFields = originalRelationFields.filter(
      o =>
        !currentRelationFields.find(
          c =>
            JSON.stringify(c.attributes?.find(ca => ca.name === 'relation')) ===
            JSON.stringify(o.attributes?.find(oa => oa.name === 'relation'))
        )
    )

    return checkAndUpdateRelationField(
      model,
      deleteRelations(tobeDeletedRelationFromFields, model.name, blocks).map(b =>
        b.id === model.id ? model : b
      )
    )
  },
  addEnum: (newEnum: Enum) => {
    return [...blocks, newEnum]
  },
  addEnums: (newEnums: Enum[]) => {
    return [...blocks, ...newEnums]
  },
  updateEnum: (toBeUpdatedEnum: Enum) => {
    return blocks.map(b => (b.id === toBeUpdatedEnum.id ? toBeUpdatedEnum : b))
  },
  deleteEntity: (entityId: number) => {
    const tobeDeleted = blocks.find(b => b.id === entityId)
    if (!tobeDeleted) {
      return blocks
    }
    const toBeDeletedName = (tobeDeleted as Entity).name
    // delete reference fields from other models
    return blocks
      .filter(b => b.id !== entityId)
      .map(b => {
        if (b.type === 'model') {
          return {
            ...b,
            properties: b.properties.filter(
              p => !(p.type === 'field' && p.fieldType === toBeDeletedName)
            )
          }
        }
        return b
      })
  },
  cleanEmptyNameEntity: () =>
    blocks.filter(b => !(['enum', 'model'].includes(b.type) && !(b as Entity).name)),
  updateEntityName: (entityId: number, name: string) => {
    const originalEntityName = (blocks.find(b => b.id === entityId) as Entity).name
    return blocks.map(b => {
      if (b.id !== entityId && b.type === 'model') {
        const newEntity = { ...(b as Model) }
        const newProperties = [...newEntity.properties]
        return {
          ...newEntity,
          properties: newProperties.map(p => {
            // 修改其他实体中关联字段的类型
            if (p.type === 'field' && p.fieldType === originalEntityName) {
              return {
                ...p,
                fieldType: name
              }
            }
            return p
          })
        }
      }
      if (b.id === entityId && ['enum', 'model'].includes(b.type)) {
        return {
          ...(b as Entity),
          name
        }
      }
      return b
    })
  }
})

export { PrismaSchemaBlockOperator }
