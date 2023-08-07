import type { OperationDefinitionNode } from 'graphql/index'
import React, { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { GlobalContext } from '@/lib/context/globalContext'
import EditPanel from '@/pages/workbench/apimanage/[...path]/components/APIFlowChart/EditPanel'
import { useAPIManager } from '@/pages/workbench/apimanage/[...path]/store'

import StatusDirective from '../APIFlowChart/StatusDirective'

export default function HookPanel({ apiPath }: { apiPath?: string }) {
  const location = useLocation()
  const [editingHook, setEditingHook] = React.useState<{ name: string; path: string } | null>(null)

  const { vscode } = useContext(GlobalContext)
  const { apiDesc, query, schemaAST, operationType, refreshAPI } = useAPIManager(state => ({
    apiDesc: state.apiDesc,
    query: state.query,
    operationType: state.computed.operationType,
    refreshAPI: state.refreshAPI,
    schemaAST: state.schemaAST
  }))
  const defs =
    (schemaAST?.definitions?.[0] as OperationDefinitionNode | undefined)?.variableDefinitions ?? []

  const hookList = useMemo(() => {
      if ( !schemaAST) {
        return []
      }
      return [{
          name: 'beforeRequest',
          enabled: apiDesc?.hooksConfiguration?.httpTransportBeforeRequest ?? false,
          path: `${dict.beforeOriginRequest}/beforeRequest.`
        }, {
          name: 'onRequest',
          enabled: apiDesc?.hooksConfiguration?.httpTransportOnRequest ?? false,
          path: `${dict.onOriginRequest}/onRequest.`
        },{
          name: 'onResponse',
          enabled: apiDesc?.hooksConfiguration?.httpTransportOnResponse ?? false,
          path: `${dict.onOriginResponse}/onResponse.`
        },{
          name: 'onConnectionInit',
          enabled: apiDesc?.hooksConfiguration?.onConnectionInit ?? false,
          path: `${dict.onOriginResponse}/onConnectionInit.`
        },{
          name: 'customResolve',
          enabled: apiDesc?.hooksConfiguration?.customResolve ?? false,
          path: `${dict.customResolve}/customResolve.`
        },{
          name: 'mutatingPostResolve',
          enabled: apiDesc?.hooksConfiguration?.mutatingPostResolve ?? false,
          path: `${dict.mutatingPostResolve}/mutatingPostResolve.`
        },{
          name: 'mutatingPreResolve',
          enabled: apiDesc?.hooksConfiguration?.mutatingPreResolve ?? false,
          can: defs?.length > 0 ?? false,
          path: `${dict.mutatingPreResolve}/mutatingPreResolve.`
        }, {
          name: 'postResolve',
          enabled: apiDesc?.hooksConfiguration?.postResolve ?? false,
          path: `${dict.postResolve}/postResolve.`
        },{
          name: 'preResolve',
          enabled: apiDesc?.hooksConfiguration?.preResolve ?? false,
          path: `${dict.preResolve}/preResolve.`
        },{
          name: 'mockResolve',
          enabled: apiDesc?.hooksConfiguration?.mockResolve.enabled ?? false,
          path: `${dict.mockResolve}/mockResolve.`
        }]
      
    }, [apiPath, schemaAST])

  // const hookList = useMemo(() => {
  //   if (!apiDesc) {
  //     return []
  //   }
  //   const list = sortBy(
  //     [...values(hookInfo.globalHooks), ...values(hookInfo.operationHooks)].map((hook: any) => ({
  //       name: hook.path.split('/').pop(),
  //       path: hook.path,
  //       enabled: hook.enabled
  //     })),
  //     x =>
  //       ({
  //         onRequest: 1,
  //         preResolve: 2,
  //         mutatingPreResolve: 3,
  //         customResolve: 4,
  //         postResolve: 5,
  //         mutatingPostResolve: 6,
  //         onResponse: 7,
  //         mockResolve: 8,
  //         onConnectionInit: 9
  //       }[x.name as string] ?? 0)
  //   ).filter(x => {
  //     // 无参数的请求不显示 mutatingPreResolve
  //     if (x.name === 'mutatingPreResolve' && !defs?.length) {
  //       return false
  //     }
  //     if (operationType === 'subscription') {
  //       if (
  //         ![
  //           'preResolve',
  //           'mutatingPostResolve',
  //           'mutatingPreResolve',
  //           'postResolve',
  //           'onConnectionInit'
  //         ].includes(x.name)
  //       ) {
  //         return false
  //       }
  //     } else {
  //       if (x.name === 'onConnectionInit') {
  //         return false
  //       }
  //     }
  //     return true
  //   })
  //   return list
  // }, [defs])

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
              vscode.show(hook.path, { hasParam: !!(query ?? '').match(/\(\$\w+/) })
              // setEditingHook(hook)
            }}
            onToggleEnabled={async flag => {
              await vscode.toggleHook(flag, hook.path, !!(query ?? '').match(/\(\$\w+/))
              refreshAPI()
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
            void refreshAPI()
            setEditingHook(null)
          }}
        />
      )}
    </>
  )
}
