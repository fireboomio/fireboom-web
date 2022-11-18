import { get, set } from 'lodash'

import type { ApiOptions } from './interface'
import { API, KeyType } from './interface'

export default function buildApi(options: ApiOptions): { path: string; content: string }[] {
  return options.apiList.map(api => apiBuilder[api](options))
}

/**
 * 构造授权字符串
 * @param options
 * @param api
 */
const buildAuthStr = (options: ApiOptions, api: API) => {
  const { authType, authApiList, roleList } = options
  return authApiList.includes(api) && roleList.length
    ? ` @rbac(${authType}: [${roleList.join(', ')}])`
    : ``
}

/**
 * 构造返回值结构
 * @param options
 * @param type
 */
const buildReturnStr = (options: ApiOptions, type: 'detail' | 'list') => {
  const obj = {}
  const q = {}
  Object.keys(options.table).forEach(key => {
    if (options.table[key][type]) {
      if (!get(obj, key)) {
        set(obj, key, true)
      }
    }
  })
  // console.log(obj)
  // console.log(convertReturnObjToStr(obj))
  return convertReturnObjToStr(obj)
}
function convertReturnObjToStr(obj: any, depth = 0): string {
  const prefix = '\n' + `  `.repeat(depth + 2)
  return Object.keys(obj)
    .map((key: string) => {
      if (obj[key] === true) {
        return prefix + key
      }
      return `${prefix}${key} {${convertReturnObjToStr(obj[key], depth + 1)}${prefix}}`
    })
    .join('')
}

// 映射类型，目前仅用于update
function mappingType(key: string, options: ApiOptions): string {
  const type = options.table[key].type
  const kind = options.table[key].kind
  const dbName = options.dbName
  if (kind === 'enum') {
    return `${dbName}_${type}`
  }
  return `${dbName}_${type}FieldUpdateOperationsInput`
}

// TODO
const foreignMap: Record<string, string> = {}

const apiBuilder: Record<API, (options: ApiOptions) => { path: string; content: string }> = {
  create(options: ApiOptions) {
    const createFields = Object.keys(options.table).filter(
      key => options.table[key].create !== KeyType.Hidden
    )
    const paramStr = createFields
      .filter(key => options.table[key].isDirectField)
      .map(key => {
        const field = options.table[key]
        let type = field.type
        if (field.kind === 'enum') {
          type = `${options.dbName}_${type}`
        }
        return `$${key}: ${type}${options.table[key].create === KeyType.Required ? '!' : ''}`
      })
      .join(', ')
    const dataStr = createFields
      .filter(key => options.table[key].isDirectField)
      .map(key => {
        if (foreignMap[key]) {
          return `${foreignMap[key]}: {connect: {id: $${key}}}`
        } else {
          return `${key}: $${key}`
        }
      })
      .join(', ')
    const returnStr = buildReturnStr(options, 'detail')

    const path = `/${options.prefix}CreateOne${options.alias}`
    const content = `
mutation ${options.prefix}CreateOne${options.alias}(${paramStr})${buildAuthStr(
      options,
      API.Create
    )} {
  data: ${options.dbName}_createOne${options.alias}(data: {${dataStr}}) {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  },
  delete(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const path = `/${options.prefix}DeleteOne${options.alias}`
    const content = `
mutation ${options.prefix}DeleteOne${
      options.alias
    }($${primaryKey}: ${primaryKeyType}!)${buildAuthStr(options, API.Delete)} {
  data: ${options.dbName}_deleteOne${options.alias}(where: {${primaryKey}: $${primaryKey}}) {
    ${primaryKey}
  }
}`.trim()
    return { path, content }
  },
  update(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const updateFields = Object.keys(options.table).filter(
      key => options.table[key].update !== KeyType.Hidden && options.table[key].isDirectField
    )
    const paramStr =
      `$${primaryKey}: ${options.table[primaryKey].type}!, ` +
      updateFields
        .map(
          key =>
            `$${key}: ${mappingType(key, options)}${
              options.table[key].update === KeyType.Required ? '!' : ''
            }`
        )
        .join(', ')
    const updateStr = updateFields
      .map(key => {
        if (foreignMap[key]) {
          return `${foreignMap[key]}: {connect: {id: $${key}}}`
        } else {
          return `${key}: $${key}`
        }
      })
      .join(', ')
    const returnStr = buildReturnStr(options, 'detail')

    const path = `/${options.prefix}UpdateOne${options.alias}`
    const content = `
mutation ${options.prefix}UpdateOne${options.alias}(${paramStr})${buildAuthStr(
      options,
      API.Update
    )} {
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
    const returnStr = buildReturnStr(options, 'detail')

    const path = `/${options.prefix}GetOne${options.alias}`
    const content = `
query ${options.prefix}GetOne${options.alias}($${primaryKey}: ${primaryKeyType}!)${buildAuthStr(
      options,
      API.Detail
    )} {
  data: ${options.dbName}_findFirst${
      options.alias
    }(where: {${primaryKey}: {equals: $${primaryKey}}}) {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  },
  list(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const returnStr = buildReturnStr(options, 'list')

    const hasSort = Object.keys(options.table).some(key => options.table[key].sort)
    const hasFilter = Object.keys(options.table).some(key => options.table[key].filter)
    const sortStr = hasSort
      ? `, $orderBy: [${options.dbName}_${options.alias}OrderByWithRelationInput]`
      : ''
    const sortStr2 = hasSort ? `\n  orderBy: $orderBy` : ''
    const filterStr = hasFilter ? `, $query: ${options.dbName}_${options.alias}WhereInput` : ''
    const filterStrInDataQuery = hasFilter ? '\n    where: {AND: $query}' : ''
    const filterStrInCountQuery = hasFilter ? '(where: {AND: $query})' : ''

    const path = `/${options.prefix}Get${options.alias}List`
    const content = `
query ${options.prefix}Get${
      options.alias
    }List($take: Int = 10, $skip: Int = 0${sortStr}${filterStr})${buildAuthStr(options, API.List)} {
  data: ${options.dbName}_findMany${options.alias}(
    skip: $skip
    take: $take${sortStr2}${filterStrInDataQuery}) {
    ${returnStr}
  }
  total: ${options.dbName}_aggregate${
      options.alias
    }${filterStrInCountQuery} @transform(get: "_count.${primaryKey}") {
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

    const path = `/${options.prefix}DeleteMany${options.alias}`

    const content = `
mutation ${options.prefix}DeleteMany${
      options.alias
    }($${primaryKey}s: [${primaryKeyType}]!)${buildAuthStr(options, API.BatchDelete)} {
  data: ${options.dbName}_deleteMany${
      options.alias
    }(where: {${primaryKey}: {in: $${primaryKey}s}}) {
    count
  }
}`.trim()
    return { path, content }
  },
  export(options: ApiOptions) {
    const returnStr = buildReturnStr(options, 'list')

    const path = `/${options.prefix}GetMany${options.alias}`
    const content = `
query ${options.prefix}GetMany${options.alias}${buildAuthStr(options, API.Export)} {
  data: ${options.dbName}_findMany${options.alias} {
    ${returnStr}
  }
}`.trim()
    return { path, content }
  }
}
