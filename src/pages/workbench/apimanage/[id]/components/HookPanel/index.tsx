import type { OperationDefinitionNode } from 'graphql/index'
import { sortBy, values } from 'lodash'
import React, { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import EditPanel from '@/pages/workbench/apimanage/[id]/components/APIFlowChart/EditPanel'
import { useAPIManager } from '@/pages/workbench/apimanage/[id]/store'

import StatusDirective from '../APIFlowChart/StatusDirective'

export default function HookPanel({ id }: { id?: string }) {
  const location = useLocation()
  const [editingHook, setEditingHook] = React.useState<{ name: string; path: string } | null>(null)

  const { vscode } = useContext(GlobalContext)
  const { apiDesc, query, operationType, refreshAPI } = useAPIManager(state => ({
    apiDesc: state.apiDesc,
    query: state.query,
    operationType: state.computed.operationType,
    refreshAPI: state.refreshAPI
  }))
  const { schemaAST } = useAPIManager(state => ({
    schemaAST: state.schemaAST
  }))
  const defs =
    (schemaAST?.definitions?.[0] as OperationDefinitionNode | undefined)?.variableDefinitions ?? []

  const { data: hookInfo, mutate: mutateHookInfo } = useSWRImmutable<any>(
    id ? `/operateApi/hooks/${id}` : null,
    requests.get,
    { revalidateOnMount: true }
  )
  const hookList = useMemo(() => {
    if (!hookInfo) {
      return []
    }
    const list = sortBy(
      [...values(hookInfo.globalHooks), ...values(hookInfo.operationHooks)].map((hook: any) => ({
        name: hook.path.split('/').pop(),
        path: hook.path,
        enabled: hook.enabled
      })),
      x =>
        ({
          onRequest: 1,
          preResolve: 2,
          mutatingPreResolve: 3,
          customResolve: 4,
          postResolve: 5,
          mutatingPostResolve: 6,
          onResponse: 7,
          mockResolve: 8,
          onConnectionInit: 9
        }[x.name as string] ?? 0)
    ).filter(x => {
      // 无参数的请求不显示 mutatingPreResolve
      if (x.name === 'mutatingPreResolve' && !defs?.length) {
        return false
      }
      if (operationType === 'subscription') {
        if (
          ![
            'preResolve',
            'mutatingPostResolve',
            'mutatingPreResolve',
            'postResolve',
            'onConnectionInit'
          ].includes(x.name)
        ) {
          return false
        }
      } else {
        if (x.name === 'onConnectionInit') {
          return false
        }
      }
      return true
    })
    return list
  }, [hookInfo, defs])

  useEffect(() => {
    setEditingHook(null)
  }, [location])

  if (!id) {
    return null
  }
  return (
    <>
      <div className="pt-2.5 w-45">
        {hookList.map((hook: any) => (
          <StatusDirective
            key={hook.name}
            className="!my-1.5 !mx-5"
            enabled={hook.enabled}
            label={hook.name}
            onClick={() => {
              vscode.show(hook.path, { hasParam: !!(query ?? '').match(/\(\$\w+/) })
              // setEditingHook(hook)
            }}
            onToggleEnabled={async flag => {
              await vscode.toggleHook(flag, hook.path, !!(query ?? '').match(/\(\$\w+/))
              mutateHookInfo()
            }}
          />
        ))}
      </div>
      {editingHook && (
        <EditPanel
          apiName={(apiDesc?.path ?? '').split('/').pop() || ''}
          hasParams={!!(query ?? '').match(/\(\$\w+/)}
          hook={editingHook}
          onClose={() => {
            void mutateHookInfo()
            setEditingHook(null)
          }}
        />
      )}
    </>
  )
}
