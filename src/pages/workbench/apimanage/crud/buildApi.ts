import type { API, ApiOptions } from './interface'
import { KeyType } from './interface'

export default async function buildApi(options: ApiOptions) {
  const result = options.apiList.reduce((acc: Record<string, string>, cur: API) => {
    acc[cur] = apiBuilder[cur](options)
    return acc
  }, {})
  console.log(result)
}

// TODO 字段默认值
const apiBuilder: Record<API, (options: ApiOptions) => string> = {
  create(options: ApiOptions) {
    const createFields = Object.keys(options.table).filter(
      key => options.table[key].create !== KeyType.Hidden
    )
    const paramStr = createFields
      .map(
        key =>
          `${key}: ${options.table[key].type}${
            options.table[key].create === KeyType.Required ? '!' : ''
          }`
      )
      .join(', ')
    const dataStr = createFields.map(key => `${key}: ${key}`).join(', ')
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].show)
      .join('\n    ')

    return `
mutation CreateOne${options.prefix}(${paramStr}) {
  data: local_createOne${options.prefix}(data: {${dataStr}) {
    ${returnStr}
  }
}`
  },
  delete: (options: ApiOptions) => {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    return `
mutation DeleteOne${options.prefix}($${primaryKey}: ${primaryKeyType}!) {
  data: local_deleteOne${options.prefix}(where: {${primaryKey}: ${primaryKey}}) {
    ${primaryKey}
  }
}`
  },
  update: (options: ApiOptions) => {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const updateFields = Object.keys(options.table).filter(
      key => options.table[key].update !== KeyType.Hidden
    )
    const paramStr = updateFields
      .map(
        key =>
          `${key}: ${options.table[key].type}${
            options.table[key].update === KeyType.Required ? '!' : ''
          }`
      )
      .join(', ')
    const updateStr = updateFields.map(key => `${key}: {set: $${key}`).join(', ')
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].show)
      .join('\n    ')
    return `
mutation UpdateOne${options.prefix}(${paramStr}) {
  data: local_updateOne${options.prefix}(
    data: {${updateStr}
    where: {${primaryKey}: $${primaryKey}}
  ) {
    ${returnStr}
  }
}`
  },
  detail(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].show)
      .join('\n    ')
    return `
query GetOne${options.prefix}($${primaryKey}: ${primaryKeyType}!) {
  data: local_findFirst${options.prefix}(where: {${primaryKey}: {equals: $${primaryKey}}) {
    ${returnStr}
  }
}`
  },
  list(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].show)
      .join('\n    ')
    return `
query Get${options.prefix}List($take: Int = 10, $skip: Int = 0) {
  data: local_findMany${options.prefix}(skip: $skip, take: $take) {
    ${returnStr}
  }
  total: local_aggregate${options.prefix} @transform(get: "_count.${primaryKey}") {
    _count {
      ${primaryKey}
    }
  }
}`
  },
  batchDelete(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    return `
mutation DeleteMany${options.prefix}($${primaryKey}s: [${primaryKeyType}]!) {
  data: local_deleteMany${options.prefix}(where: {${primaryKey}: {in: $${primaryKey}s}) {
    count
  }
}`
  },
  export(options: ApiOptions) {
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].show)
      .join('\n    ')
    return `
query GetMany${options.prefix}() {
  data: local_findMany${options.prefix}() {
    ${returnStr}
  }
}`
  }
}
