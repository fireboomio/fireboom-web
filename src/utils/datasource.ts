import { DataSourceKind } from '@/interfaces/datasource'
import type { ApiDocuments } from '@/services/a2s.namespace'

export function isDatabaseKind(ds: ApiDocuments.Datasource) {
  return [
    DataSourceKind.MongoDB,
    DataSourceKind.MySQL,
    DataSourceKind.PostgreSQL,
    DataSourceKind.SQLite,
    DataSourceKind.SQLServer
  ].includes(+ds.kind)
}

export const databaseKindNameMap = {
  [DataSourceKind.MongoDB]: 'MongoDB',
  [DataSourceKind.MySQL]: 'MySQL',
  [DataSourceKind.PostgreSQL]: 'PostgreSQL',
  [DataSourceKind.SQLite]: 'SQLite',
  [DataSourceKind.SQLServer]: 'SQLServer'
}
