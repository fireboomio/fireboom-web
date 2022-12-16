import type { AttributeArgument, Func, KeyValue, RelationArray } from '@mrleebo/prisma-ast'

const AttributeArgHelper = {
  extractDefaultAttrArgs: (args: AttributeArgument[]) => {
    const { value } = args[0] ?? { value: undefined }
    const functionValue = typeof value === 'object' && (value as Func).name
    return functionValue || (value as string)
  },
  extractNormalAttrArgs: (args: AttributeArgument[]) => {
    const { value } = args[0] ?? { value: undefined }
    return value as string
  },
  extractIndexAttributeArgs: (args: AttributeArgument[]) => {
    const argValues = args?.map(arg => arg.value) ?? []

    const fieldNamesWithKey = (argValues as KeyValue[])
      .filter(value => value.key === 'fields')
      .map(value => value.value as RelationArray)
      .flatMap(relationAry => relationAry.args)
    const fieldNameArray = argValues.length >= 1 ? (argValues[0] as RelationArray).args : []
    const name = args
      ?.map(arg => arg.value as KeyValue)
      .filter(value => value.key === 'name')
      .map(value => value.value as string)[0]
    const map = args
      ?.map(arg => arg.value as KeyValue)
      .filter(value => value.key === 'map')
      .map(value => value.value as string)[0]
    return {
      fields: fieldNamesWithKey.length > 0 ? fieldNamesWithKey : fieldNameArray,
      name,
      map
    }
  },
  extractRelationAttributeArgs: (args: AttributeArgument[]) => {
    const name = args
      .map(attrArg => attrArg.value as KeyValue)
      .filter(value => value.key === 'name')
      .map(value => value.value as string)[0]

    const nameWithoutKey = !(args[0]?.value as KeyValue)?.key
      ? (args[0]?.value as string)
      : undefined

    const fields = args
      .map(attrArg => attrArg.value as KeyValue)
      .filter(value => value.key === 'fields')
      .map(value => value.value as RelationArray)
      .flatMap(array => array.args)

    const references = args
      .map(attrArg => attrArg.value as KeyValue)
      .filter(value => value.key === 'references')
      .map(value => value.value as RelationArray)
      .flatMap(array => array.args)

    return {
      name: name || nameWithoutKey,
      fields,
      references
    }
  },
  buildNewRelationArgs: (
    name: string | undefined,
    fields: string[],
    references: string[]
  ): AttributeArgument[] => {
    const args: AttributeArgument[] = []
    if (name) {
      args.push({
        type: 'attributeArgument',
        value: {
          type: 'keyValue',
          key: 'name',
          value: name
        }
      })
    }
    if (fields && fields.length > 0) {
      args.push({
        type: 'attributeArgument',
        value: {
          type: 'keyValue',
          key: 'fields',
          value: {
            type: 'array',
            args: fields
          }
        }
      })
    }
    if (references && references.length > 0) {
      args.push({
        type: 'attributeArgument',
        value: {
          type: 'keyValue',
          key: 'references',
          value: {
            type: 'array',
            args: references
          }
        }
      })
    }
    return args
  }
}

export default AttributeArgHelper
