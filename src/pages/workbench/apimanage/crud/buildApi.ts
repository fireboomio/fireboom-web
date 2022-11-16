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

    const path = `/CreateOne${options.alias}`
    const content = `
mutation CreateOne${options.alias}(${paramStr}) {
  data: ${options.dbName}_createOne${options.alias}(data: {${dataStr}}) {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  },
  delete(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const path = `/DeleteOne${options.alias}`
    const content = `
mutation DeleteOne${options.alias}($${primaryKey}: ${primaryKeyType}!) {
  data: ${options.dbName}_deleteOne${options.alias}(where: {${primaryKey}: $${primaryKey}}) {
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

    const path = `/UpdateOne${options.alias}`
    const content = `
mutation UpdateOne${options.alias}(${paramStr}) {
  data: ${options.dbName}_updateOne${options.alias}(
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

    const path = `/GetOne${options.alias}`
    const content = `
query GetOne${options.alias}($${primaryKey}: ${primaryKeyType}!) {
  data: ${options.dbName}_findFirst${options.alias}(where: {${primaryKey}: {equals: $${primaryKey}}}) {
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

    const hasSort = Object.keys(options.table).some(key => options.table[key].sort)
    const hasFilter = Object.keys(options.table).some(key => options.table[key].filter)
    const sortStr = hasSort
      ? `, $orderBy: [${options.dbName}_${options.alias}OrderByWithRelationInput]`
      : ''
    const filterStr = hasFilter ? `, $query: ${options.dbName}_${options.alias}WhereInput` : ''
    const filterStrInDataQuery = hasFilter ? '\n    where: {AND: $query}' : ''
    const filterStrInCountQuery = hasFilter ? '(where: {AND: $query})' : ''

    const path = `/Get${options.alias}List`
    const content = `
query Get${options.alias}List($take: Int = 10, $skip: Int = 0${sortStr}${filterStr}) {
  data: ${options.dbName}_findMany${options.alias}(
    skip: $skip
    take: $take${filterStrInDataQuery}) {
    ${returnStr}
  }
  total: ${options.dbName}_aggregate${options.alias}${filterStrInCountQuery} @transform(get: "_count.${primaryKey}") {
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

    const path = `/DeleteMany${options.alias}`

    const content = `
mutation DeleteMany${options.alias}($${primaryKey}s: [${primaryKeyType}]!) {
  data: ${options.dbName}_deleteMany${options.alias}(where: {${primaryKey}: {in: $${primaryKey}s}}) {
    count
  }
}`.trim()
    return { path, content }
  },
  export(options: ApiOptions) {
    const returnStr = Object.keys(options.table)
      .filter(key => options.table[key].list)
      .join('\n    ')

    const path = `/GetMany${options.alias}`
    const content = `
query GetMany${options.alias} {
  data: ${options.dbName}_findMany${options.alias} {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  }
}
