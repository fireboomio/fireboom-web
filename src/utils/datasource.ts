import { message } from 'antd'
import { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import { DataSourceKind } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'
import { getFireboomFileContent } from '@/providers/ServiceDiscovery'
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
  customGraphql?: {
    customized?: boolean
  }
}) {
  let icon = '/assets/icon/db-other.svg'
  switch (ds?.kind) {
    case DataSourceKind.Graphql:
      if (ds.customGraphql?.customized) {
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

type HookState = Record<
  string,
  {
    customize: boolean
    proxy: boolean
    function: boolean
  }
>

let resolveFunc: (value: boolean) => void
let readyPromise = new Promise<boolean>(resolve => {
  resolveFunc = resolve
})

export function useHookSupport() {
  const intl = useIntl()
  const { data } = useSWRImmutable<ApiDocuments.Sdk>('/sdk/enabledServer', requests)
  const { data: hookState, isLoading } = useSWRImmutable<HookState>(
    'hook.state.json',
    getFireboomFileContent
  )

  useEffect(() => {
    if (!isLoading) {
      resolveFunc(true)
    }
  }, [isLoading])

  async function checkSupport(funcName: keyof HookState['string']) {
    await readyPromise
    const support = data?.name ? !!hookState?.[data.name]?.[funcName] : false
    if (!support) {
      message.warning(intl.formatMessage({ defaultMessage: '当前钩子语言暂不支持该功能' }))
    }
    return support
  }

  return { checkSupport }
}
