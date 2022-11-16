import type { API, ApiOptions } from './interface'
import { KeyType } from './interface'

export default function buildApi(options: ApiOptions): { path: string; content: string }[] {
  return options.apiList.map(api => apiBuilder[api](options))
}

const apiBuilder: Record<API, (options: ApiOptions) => { path: string; content: string }> = {
  create(options: ApiOptions) {
    const createFields = Object.keys(options.table).filter(
      key => options.table[key].create !== KeyType.Hidden
    )
    const paramStr = createFields
      .map(
        key =>
          `$${key}: ${options.table[key].type}${
            options.table[key].create === KeyType.Required ? '!' : ''
          }`
      )
      .join(', ')
    const dataStr = createFields.map(key => `${key}: $${key}`).join(', ')
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].detail)
      .join('\n    ')

    const path = `/CreateOne${options.prefix}`
    const content = `
mutation CreateOne${options.prefix}(${paramStr}) {
  data: ${options.dbName}_createOne${options.prefix}(data: {${dataStr}}) {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  },
  delete(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const path = `/DeleteOne${options.prefix}`
    const content = `
mutation DeleteOne${options.prefix}($${primaryKey}: ${primaryKeyType}!) {
  data: ${options.dbName}_deleteOne${options.prefix}(where: {${primaryKey}: $${primaryKey}}) {
    ${primaryKey}
  }
}`.trim()
    return { path, content }
  },
  update(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const updateFields = Object.keys(options.table).filter(
      key => options.table[key].update !== KeyType.Hidden
    )
    const paramStr =
      updateFields
        .map(
          key =>
            `$${key}: ${options.table[key].type}${
              options.table[key].update === KeyType.Required ? '!' : ''
            }`
        )
        .join(', ') + `, $${primaryKey}: ${options.table[primaryKey].type}!`
    const updateStr = updateFields.map(key => `${key}: {set: $${key}}`).join(', ')
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].detail)
      .join('\n    ')

    const path = `/UpdateOne${options.prefix}`
    const content = `
mutation UpdateOne${options.prefix}(${paramStr}) {
  data: ${options.dbName}_updateOne${options.prefix}(
    data: {${updateStr}}
    where: {${primaryKey}: $${primaryKey}}
  ) {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  },
  detail(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].detail)
      .join('\n    ')

    const path = `/GetOne${options.prefix}`
    const content = `
query GetOne${options.prefix}($${primaryKey}: ${primaryKeyType}!) {
  data: ${options.dbName}_findFirst${options.prefix}(where: {${primaryKey}: {equals: $${primaryKey}}}) {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  },
  list(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].list)
      .join('\n    ')

    const path = `/Get${options.prefix}List`
    const content = `
query Get${options.prefix}List($take: Int = 10, $skip: Int = 0) {
  data: ${options.dbName}_findMany${options.prefix}(skip: $skip, take: $take) {
    ${returnStr}
  }
  total: ${options.dbName}_aggregate${options.prefix} @transform(get: "_count.${primaryKey}") {
    _count {
      ${primaryKey}
    }
  }
}`.trim()
    return { path, content }
  },
  batchDelete(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type

    const path = `/DeleteMany${options.prefix}`

    const content = `
mutation DeleteMany${options.prefix}($${primaryKey}s: [${primaryKeyType}]!) {
  data: ${options.dbName}_deleteMany${options.prefix}(where: {${primaryKey}: {in: $${primaryKey}s}}) {
    count
  }
}`.trim()
    return { path, content }
  },
  export(options: ApiOptions) {
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].list)
      .join('\n    ')

    const path = `/GetMany${options.prefix}`
    const content = `
query GetMany${options.prefix} {
  data: ${options.dbName}_findMany${options.prefix} {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  }
}
