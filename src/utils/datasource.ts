import { DataSourceKind } from '@/interfaces/datasource'
import type { ApiDocuments } from '@/services/a2s.namespace'

export function isDatabaseKind(ds: ApiDocuments.Datasource) {
  return [
    DataSourceKind.MongoDB,
    DataSourceKind.MySQL,
    DataSourceKind.PostgreSQL,
    DataSourceKind.SQLite,
    DataSourceKind.SQLServer,
    DataSourceKind.Prisma
  ].includes(+ds.kind)
}

export const databaseKindNameMap = {
  [DataSourceKind.MongoDB]: 'MongoDB',
  [DataSourceKind.MySQL]: 'MySQL',
  [DataSourceKind.PostgreSQL]: 'PostgreSQL',
  [DataSourceKind.SQLite]: 'SQLite',
  [DataSourceKind.SQLServer]: 'SQLServer'
}

export function getDataSourceIcon(ds: {
  kind: DataSourceKind | string
  customGraph?: {
    customized?: boolean
  }
}) {
  let icon = '/assets/icon/db-other.svg'
  switch (ds?.kind) {
    case DataSourceKind.Graphql:
      if (ds.customGraph?.customized) {
        icon = '/assets/icon/graphql-custom.svg'
      } else {
        icon = '/assets/icon/graphql.svg'
      }
      break
    case DataSourceKind.Restful:
      icon = '/assets/icon/rest.svg'
      break
    case DataSourceKind.MongoDB:
      icon = '/assets/icon/mongodb.svg'
      break
    case DataSourceKind.MySQL:
      icon = '/assets/icon/mysql.svg'
      break
    case DataSourceKind.PostgreSQL:
      icon = '/assets/icon/pgsql.svg'
      break
    case DataSourceKind.SQLite:
      icon = '/assets/icon/sqlite.svg'
      break
    case DataSourceKind.Prisma:
      icon = '/assets/icon/prisma.svg'
      break
  }
  return icon
}
