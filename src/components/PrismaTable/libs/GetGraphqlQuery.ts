import tag from 'graphql-tag'

import type { SchemaModel } from './types'

const getFields = (models: SchemaModel[], modelName: string, update = false) => {
  const model = models.find(item => item.id === modelName)
  if (!model) {
    return 'id'
  }
  let fieldsString = `${model.idField} `
  model?.fields.forEach(field => {
    if ((field.read && field.name !== model.idField) || (update && field.update)) {
      if (field.kind !== 'object') {
        fieldsString += `${field.name} `
      } else if (!(field.list && !update)) {
        const fieldModel = models.find(item => item.id === field.type)
        if (fieldModel) {
          fieldsString += `${field.name} {`
          if (fieldModel.idField) {
            fieldsString += `${fieldModel.idField} `
          } else {
            fieldModel.fields
              .filter(item => item.kind === 'scalar')
              .forEach(field => {
                fieldsString += `${field.name} `
              })
          }
          if (!field.list) {
            fieldModel.displayFields.forEach(item => {
              const splitItems = item.split('.')
              for (let i = 0; i < splitItems.length; i++) {
                if (i + 1 < splitItems.length) {
                  fieldsString += `${splitItems[i]} { `
                } else if (!(splitItems.length === 1 && splitItems[i] === fieldModel.idField)) {
                  fieldsString += `${splitItems[i]} `
                }
              }
              for (let i = 1; i < splitItems.length; i++) {
                fieldsString += '} '
              }
            })
          }
          fieldsString += '} '
        }
      }
    }
  })
  return fieldsString
}

const graphQLNamespacePrefix = (namespace: string | undefined) => (namespace ? `${namespace}_` : '')

const allScalar = (model?: SchemaModel) => {
  return model?.fields
    .filter(item => item.kind === 'scalar')
    .map(item => item.name)
    .join(' ')
}
export const getGraphqlQuery = (
  models: SchemaModel[],
  modelName: string,
  namespace = '',
  findUnique = false,
  update = false
) => {
  const fields = getFields(models, modelName, update)
  if (findUnique) {
    return tag`
      query ${graphQLNamespacePrefix(
        namespace
      )}findUnique${modelName}($where: ${graphQLNamespacePrefix(
      namespace
    )}${modelName}WhereUniqueInput!) {
        ${graphQLNamespacePrefix(namespace)}findUnique${modelName}(where: $where) {
          ${fields}
        }
      }`
  } else {
    // ${graphQLNamespacePrefix(namespace)}findMany${modelName}Count(where: $where)  --- 原先的count写法，改为 aggregate

    // $cursor: ${graphQLNamespacePrefix(namespace)}${modelName}WhereUniqueInput
    // , cursor: $cursor
    return tag`
      query ${graphQLNamespacePrefix(namespace)}findMany${modelName}(
        $where: ${graphQLNamespacePrefix(namespace)}${modelName}WhereInput
        $orderBy: [${graphQLNamespacePrefix(namespace)}${modelName}OrderByWithRelationInput!]

        $skip: Int
        $take: Int
      ) {
        ${graphQLNamespacePrefix(
          namespace
        )}findMany${modelName}(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
          ${fields}
        }

        ${graphQLNamespacePrefix(namespace)}aggregate${modelName}(where: $where) {
          _count {
            _all
          }
        }
      }`
  }
}

export const getGraphqlMutation = (
  models: SchemaModel[],
  model: string,
  mutation: 'create' | 'update' | 'delete',
  namespace?: string
) => {
  const fields = getFields(models, model, true)
  const modelObject = models.find(item => item.id === model)
  switch (mutation) {
    case 'create':
      return tag`mutation ${graphQLNamespacePrefix(
        namespace
      )}createOne${model}($data: ${graphQLNamespacePrefix(namespace)}${model}CreateInput!) {
              ${graphQLNamespacePrefix(namespace)}createOne${model}(data: $data) {
                ${modelObject?.idField || allScalar(modelObject)}
              }
            }`
    case 'delete':
      return tag`mutation deleteOne${model} ($where: ${graphQLNamespacePrefix(
        namespace
      )}${model}WhereUniqueInput!) {
  ${graphQLNamespacePrefix(namespace)}deleteOne${model} (where: $where) {
    ${modelObject?.idField || allScalar(modelObject)}
  }
}`
    case 'update':
      return tag`mutation ${graphQLNamespacePrefix(
        namespace
      )}updateOne${model} ($where: ${graphQLNamespacePrefix(
        namespace
      )}${model}WhereUniqueInput!, $data: ${graphQLNamespacePrefix(
        namespace
      )}${model}UpdateInput!) {
  ${graphQLNamespacePrefix(namespace)}updateOne${model} (where: $where, data: $data) {
    ${fields}
  }
}`
  }
}
