import type { OperationDefinitionNode } from 'graphql/index'
import React, { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import useImmutableSWR from 'swr/immutable'

import { GlobalContext } from '@/lib/context/globalContext'
import EditPanel from '@/pages/workbench/apimanage/[...path]/components/APIFlowChart/EditPanel'
import { useAPIManager } from '@/pages/workbench/apimanage/[...path]/store'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'

import StatusDirective from '../APIFlowChart/StatusDirective'

export default function HookPanel({ apiPath }: { apiPath?: string }) {
  const location = useLocation()
  const [editingHook, setEditingHook] = React.useState<{ name: string; path: string } | null>(null)

  const { vscode } = useContext(GlobalContext)
  const dict = useDict()
  const { apiDesc, schemaAST, operationType, refreshAPI } = useAPIManager(state => ({
    apiDesc: state.apiDesc,
    query: state.query,
    operationType: state.computed.operationType,
    refreshAPI: state.refreshAPI,
    schemaAST: state.schemaAST
  }))

  const defs = useMemo(
    () =>
      (schemaAST?.definitions?.[0] as OperationDefinitionNode | undefined)?.variableDefinitions ??
      [],
    [schemaAST]
  )

  const { data: globalHooksState } = useImmutableSWR<any, ApiDocuments.models_HookOptions>(
    '/globalOperation/hookOptions'
  )

  const hookList = useMemo(() => {
    if (!schemaAST) {
      return []
    }

    const hooks = [
      {
        name: 'beforeRequest',
        enabled: globalHooksState?.beforeOriginRequest?.enabled ?? false,
        path: globalHooksState?.beforeOriginRequest?.path
      },
      {
        name: 'onRequest',
        enabled: globalHooksState?.onOriginRequest?.enabled ?? false,
        path: globalHooksState?.onOriginRequest?.path
      },
      {
        name: 'onResponse',
        enabled: globalHooksState?.onOriginResponse?.enabled ?? false,
        path: globalHooksState?.onOriginResponse?.path
      },
      {
        name: 'onConnectionInit',
        enabled: globalHooksState?.onConnectionInit?.enabled ?? false,
        path: globalHooksState?.onConnectionInit?.path
      },
      {
        name: 'mockResolve',
        enabled: apiDesc?.hooksConfiguration?.mockResolve?.enabled ?? false,
        path: `${dict.mockResolve}/${apiDesc?.path}/mockResolve`
      },
      {
        name: 'preResolve',
        enabled: apiDesc?.hooksConfiguration?.preResolve ?? false,
        path: `${dict.preResolve}/${apiDesc?.path}/preResolve`
      },
      {
        name: 'mutatingPreResolve',
        enabled: apiDesc?.hooksConfiguration?.mutatingPreResolve ?? false,
        can: defs?.length > 0 ?? false,
        path: `${dict.mutatingPreResolve}/${apiDesc?.path}/mutatingPreResolve`
      },
      {
        name: 'customResolve',
        enabled: apiDesc?.hooksConfiguration?.customResolve ?? false,
        path: `${dict.customResolve}/${apiDesc?.path}/customResolve`
      },
      {
        name: 'postResolve',
        enabled: apiDesc?.hooksConfiguration?.postResolve ?? false,
        path: `${dict.postResolve}/${apiDesc?.path}/postResolve`
      },
      {
        name: 'mutatingPostResolve',
        enabled: apiDesc?.hooksConfiguration?.mutatingPostResolve ?? false,
        path: `${dict.mutatingPostResolve}/${apiDesc?.path}/mutatingPostResolve`
      }
    ]
    return hooks.filter(hook => {
      // 无参数的请求不显示 mutatingPreResolve
      if (!defs?.length && hook.name === 'mutatingPreResolve') {
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
          ].includes(hook.name)
        ) {
          return false
        }
      } else {
        if (hook.name === 'onConnectionInit') {
          return false
        }
      }
      return true
    })
  }, [apiDesc, operationType, schemaAST, defs, dict, globalHooksState])

  useEffect(() => {
    setEditingHook(null)
  }, [location])

  if (!apiPath) {
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
              vscode.show(hook.path, { hasParam: defs.length > 0 })
              // setEditingHook(hook)
            }}
            onToggleEnabled={async flag => {
              await vscode.toggleOperationHook(flag, hook.path, apiPath, defs.length > 0)
              refreshAPI()
            }}
          />
        ))}
      </div>
      {editingHook && (
        <EditPanel
          apiName={(apiDesc?.path ?? '').split('/').pop() || ''}
          hasParams={defs.length > 0}
          hook={editingHook}
          onClose={() => {
            void refreshAPI()
            setEditingHook(null)
          }}
        />
      )}
    </>
  )
}
