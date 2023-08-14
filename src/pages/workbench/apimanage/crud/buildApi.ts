import { get, set } from 'lodash'

import type { ApiDocuments } from '@/services/a2s.namespace'

import type { ApiOptions } from './interface'
import { API, AuthOptions, KeyType } from './interface'

export default function buildApi(options: ApiOptions): Partial<ApiDocuments.Operation>[] {
  let setting: Partial<ApiDocuments.Operation> | undefined = undefined
  if (options.auth === AuthOptions.enabled) {
    setting = { enabled: true, authenticationConfig: { authRequired: true } }
  } else if (options.auth === AuthOptions.disabled) {
    setting = { enabled: true, authenticationConfig: { authRequired: false } }
  }
  return options.apiList.map(api => {
    return {
      ...apiBuilder[api](options),
      ...(options.authApiList.includes(api) ? setting : undefined)
    }
  })
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

const apiBuilder: Record<API, (options: ApiOptions) => { path: string; originContent: string }> = {
  create(options: ApiOptions) {
    const createFields = Object.keys(options.table).filter(
      key => options.table[key].create !== KeyType.Hidden
    )
    const paramStr = createFields
      .filter(key => options.table[key].isDirectField)
      .map(key => {
        const field = options.table[key]
        // let type = field.type
        // if (field.kind === 'enum') {
        //   type = `${options.dbName}_${type}`
        // }
        const type = field.createType
        return `$${key}: ${type.name}${options.table[key].create === KeyType.Required ? '!' : ''}${
          options.table[key].directive
        }`
      })
      .join(', ')
    const dataStr = createFields
      .filter(key => options.table[key].isDirectField)
      .map(key => {
        return `${key}: $${key}`
      })
      .join(', ')
    const returnStr = buildReturnStr(options, 'detail')

    const path = (options.prefix ? `/${options.prefix}` : '') + `/CreateOne${options.alias}`
    const content = `
mutation CreateOne${options.alias}(${paramStr})${buildAuthStr(options, API.Create)} {
  data: ${options.dbName}_createOne${options.modelName}(data: {${dataStr}}) {
    ${returnStr}
  }
}`.trim()
    return { path, originContent: content }
  },
  delete(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const path = (options.prefix ? `/${options.prefix}` : '') + `/DeleteOne${options.alias}`
    const content = `
mutation DeleteOne${options.alias}($${primaryKey}: ${primaryKeyType}!)${buildAuthStr(
      options,
      API.Delete
    )} {
  data: ${options.dbName}_deleteOne${options.modelName}(where: {${primaryKey}: $${primaryKey}}) {
    ${primaryKey}
  }
}`.trim()
    return { path, originContent: content }
  },
  update(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const updateFields = Object.keys(options.table)
      .filter(
        key => options.table[key].update !== KeyType.Hidden && options.table[key].isDirectField
      )
      .map(key => ({
        key,
        ...options.table[key].updateType
      }))
    const paramStr =
      `$${primaryKey}: ${options.table[primaryKey].type}!, ` +
      updateFields
        .map(
          field =>
            `$${field.key}: ${field.name}${
              options.table[field.key].update === KeyType.Required ? '!' : ''
            }${options.table[field.key].directive}`
        )
        .join(', ')
    const updateStr = updateFields
      .map(field => {
        return `${field.key}: ${field.isSet ? `{set: $${field.key}}` : `$${field.key}`}`
      })
      .join(', ')
    const returnStr = buildReturnStr(options, 'detail')

    const path = (options.prefix ? `/${options.prefix}` : '') + `/UpdateOne${options.alias}`
    const content = `
mutation UpdateOne${options.alias}(${paramStr})${buildAuthStr(options, API.Update)} {
  data: ${options.dbName}_updateOne${options.modelName}(
    data: {${updateStr}}
    where: {${primaryKey}: $${primaryKey}}
  ) {
    ${returnStr}
  }
}`.trim()
    return { path, originContent: content }
  },
  detail(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type
    const returnStr = buildReturnStr(options, 'detail')

    const path = (options.prefix ? `/${options.prefix}` : '') + `/GetOne${options.alias}`
    const content = `
query GetOne${options.alias}($${primaryKey}: ${primaryKeyType}!)${buildAuthStr(
      options,
      API.Detail
    )} {
  data: ${options.dbName}_findFirst${
      options.modelName
    }(where: {${primaryKey}: {equals: $${primaryKey}}}) {
    ${returnStr}
  }
}`.trim()
    return { path, originContent: content }
  },
  list(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const returnStr = buildReturnStr(options, 'list')

    const hasSort = Object.keys(options.table).some(key => options.table[key].sort)
    const hasFilter = Object.keys(options.table).some(key => options.table[key].filter)
    const sortStr = hasSort
      ? `, $orderBy: [${options.dbName}_${options.modelName}OrderByWithRelationInput]`
      : ''
    const sortStr2 = hasSort ? `\n  orderBy: $orderBy` : ''
    const filterStr = hasFilter ? `, $query: ${options.dbName}_${options.modelName}WhereInput` : ''
    const filterStrInDataQuery = hasFilter ? '\n    where: {AND: $query}' : ''
    const filterStrInCountQuery = hasFilter ? '(where: {AND: $query})' : ''

    const path = (options.prefix ? `/${options.prefix}` : '') + `/Get${options.alias}List`
    const content = `
query Get${options.alias}List($take: Int = 10, $skip: Int = 0${sortStr}${filterStr})${buildAuthStr(
      options,
      API.List
    )} {
  data: ${options.dbName}_findMany${options.modelName}(
    skip: $skip
    take: $take${sortStr2}${filterStrInDataQuery}) {
    ${returnStr}
  }
  total: ${options.dbName}_aggregate${
      options.modelName
    }${filterStrInCountQuery} @transform(get: "_count.${primaryKey}") {
    _count {
      ${primaryKey}
    }
  }
}`.trim()
    return { path, originContent: content }
  },
  batchDelete(options: ApiOptions) {
    const primaryKey = options.primaryKey
    const primaryKeyType = options.table[primaryKey].type

    const path = (options.prefix ? `/${options.prefix}` : '') + `/DeleteMany${options.alias}`

    const content = `
mutation DeleteMany${options.alias}($${primaryKey}s: [${primaryKeyType}]!)${buildAuthStr(
      options,
      API.BatchDelete
    )} {
  data: ${options.dbName}_deleteMany${
      options.modelName
    }(where: {${primaryKey}: {in: $${primaryKey}s}}) {
    count
  }
}`.trim()
    return { path, originContent: content }
  },
  export(options: ApiOptions) {
    const returnStr = buildReturnStr(options, 'list')

    const path = (options.prefix ? `/${options.prefix}` : '') + `/GetMany${options.alias}`
    const content = `
query GetMany${options.alias}${buildAuthStr(options, API.Export)} {
  data: ${options.dbName}_findMany${options.modelName} {
    ${returnStr}
  }
}`.trim()
    return { path, originContent: content }
  }
}
