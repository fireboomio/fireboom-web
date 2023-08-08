import type { OperationDefinitionNode, OperationTypeNode } from 'graphql'
import { isEqual } from 'lodash'
import React, { lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react'
import useImmutableSWR from 'swr/immutable'

import { useDebounceMemo } from '@/hooks/debounce'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import { parseParameters } from '@/lib/gql-parser'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'

import { useAPIManager } from '../../store'
import EditPanel from './EditPanel'
import type { FlowChartProps } from './FlowChart'
import type {
  CommonChartProps,
  NormalGlobalHookState,
  SubscriptionGlobalHookState
} from './interface'
// import FlowChart from './FlowChart'
import InternalOperationChart from './InternalOperation'

type DirectiveState = FlowChartProps['directiveState']
type GlobalState = FlowChartProps['globalHookState']
type HookState = FlowChartProps['hookState']

const FlowChart = lazy(() => import('./FlowChart'))
const SubscriptionChart = lazy(() => import('./SubscriptionChart'))

const APIFlowChart = ({ apiPath }: { apiPath: string }) => {
  const {
    apiDesc,
    schemaAST,
    schemaTypeMap,
    query,
    operationType,
    appendToAPIRefresh,
    dispendToAPIRefresh,
    refreshAPI
  } = useAPIManager(state => ({
    apiDesc: state.apiDesc,
    schemaAST: state.schemaAST,
    query: state.query,
    operationType: state.computed.operationType,
    schemaTypeMap: state.schemaTypeMap,
    appendToAPIRefresh: state.appendToAPIRefresh,
    dispendToAPIRefresh: state.dispendToAPIRefresh,
    refreshAPI: state.refreshAPI
  }))
  const { vscode } = useContext(GlobalContext)
  const dict = useDict()
  const [globalState, setGlobalState] = useState<GlobalState>()
  const [hookState, setHookState] = useState<HookState>()
  const [editingHook, setEditingHook] = useState<{ name: string; path: string } | null>(null)

  const directiveState = useDebounceMemo(
    () => {
      const defs =
        (schemaAST?.definitions[0] as OperationDefinitionNode | undefined)?.variableDefinitions ??
        []
      const variables = parseParameters(defs, schemaTypeMap)
      const globalDirectives = (
        schemaAST?.definitions[0] as OperationDefinitionNode | undefined
      )?.directives?.map(dir => dir.name.value)
      const allDirectives = variables.reduce<string[]>((arr, item) => {
        arr.push(...(item.directives?.map(dir => dir.name) ?? []))
        return arr
      }, [])
      const state: DirectiveState = {
        isInternal: globalDirectives?.includes('internalOperation') ?? false,
        fromClaim: allDirectives.includes('fromClaim'),
        injectCurrentDatetime: allDirectives.includes('injectCurrentDatetime'),
        injectEnvironmentVariable: allDirectives.includes('injectEnvironmentVariable'),
        injectGeneratedUUID: allDirectives.includes('injectGeneratedUUID'),
        jsonSchema: allDirectives.includes('jsonSchema'),
        rbac:
          (schemaAST?.definitions[0] as OperationDefinitionNode | undefined)?.directives?.some(
            dir => dir.name.value === 'rbac'
          ) ?? false,
        transform: query.includes('@transform')
      }
      return state
    },
    1000,
    [query, schemaAST?.definitions]
  )

  const { data: globalHooksState, mutate: mutateGlobalHooks } = useImmutableSWR<
    any,
    ApiDocuments.models_HookOptions
  >('/globalOperation/hookOptions', requests.get)

  const loadHook = useCallback(() => {
    if (!schemaAST) {
      return
    }
    setGlobalState({
      beforeRequest: {
        name: 'beforeRequest',
        enabled: globalHooksState?.beforeOriginRequest?.enabled ?? false,
        path: globalHooksState?.beforeOriginRequest?.path?.replace(/\.\w+/, '')
      },
      onRequest: {
        name: 'onRequest',
        enabled: globalHooksState?.onOriginRequest?.enabled ?? false,
        path: globalHooksState?.onOriginRequest?.path?.replace(/\.\w+/, '')
      },
      onResponse: {
        name: 'onResponse',
        enabled: globalHooksState?.onOriginResponse?.enabled ?? false,
        path: globalHooksState?.onOriginResponse?.path?.replace(/\.\w+/, '')
      },
      // @ts-ignore
      onConnectionInit: {
        name: 'onConnectionInit',
        enabled: globalHooksState?.onConnectionInit?.enabled ?? false,
        path: globalHooksState?.onConnectionInit?.path?.replace(/\.\w+/, '')
      }
    })
    const defs =
      (schemaAST.definitions[0] as OperationDefinitionNode | undefined)?.variableDefinitions ?? []
    setHookState({
      customResolve: {
        name: 'customResolve',
        enabled: apiDesc?.hooksConfiguration?.customResolve ?? false,
        path: `${dict.customResolve}/${apiDesc?.path}/customResolve`
      },
      mutatingPostResolve: {
        name: 'mutatingPostResolve',
        enabled: apiDesc?.hooksConfiguration?.mutatingPostResolve ?? false,
        path: `${dict.mutatingPostResolve}/${apiDesc?.path}/mutatingPostResolve`
      },
      mutatingPreResolve: {
        name: 'mutatingPreResolve',
        enabled: apiDesc?.hooksConfiguration?.mutatingPreResolve ?? false,
        can: defs?.length > 0 ?? false,
        path: `${dict.mutatingPreResolve}/${apiDesc?.path}/mutatingPreResolve`
      },
      postResolve: {
        name: 'postResolve',
        enabled: apiDesc?.hooksConfiguration?.postResolve ?? false,
        path: `${dict.postResolve}/${apiDesc?.path}/postResolve`
      },
      preResolve: {
        name: 'preResolve',
        enabled: apiDesc?.hooksConfiguration?.preResolve ?? false,
        path: `${dict.preResolve}/${apiDesc?.path}/preResolve`
      },
      mockResolve: {
        name: 'mockResolve',
        enabled: apiDesc?.hooksConfiguration?.mockResolve?.enabled ?? false,
        path: `${dict.mockResolve}/${apiDesc?.path}/mockResolve`
      }
    })
  }, [schemaAST, dict, apiDesc, globalHooksState])

  useEffect(() => {
    loadHook()
    appendToAPIRefresh(loadHook)
    return () => {
      dispendToAPIRefresh(loadHook)
    }
  }, [appendToAPIRefresh, loadHook, dispendToAPIRefresh])

  // 监听路由变化，当路由变化时自动关闭钩子编辑器
  useEffect(() => {
    setEditingHook(null)
  }, [apiPath])
  const hasParam = !!(query ?? '').match(/\(\$\w+/)
  const onEditHook = useCallback(
    (hook: { name: string; path: string }) => {
      vscode.show(hook.path, { hasParam })
    },
    [hasParam, vscode]
  )
  const onToggleHook = useCallback(
    async (hook: { name: string; path: string }, flag: boolean) => {
      await vscode.toggleOperationHook(flag, hook.path, apiPath, hasParam)
      refreshAPI()
      mutateGlobalHooks()
    },
    [vscode, apiPath, hasParam, refreshAPI, mutateGlobalHooks]
  )

  return (
    <>
      {apiDesc && schemaAST && (
        <ChartWrapper
          apiDesc={apiDesc}
          directiveState={directiveState}
          // @ts-ignore
          globalHookState={globalState}
          // @ts-ignore
          hookState={hookState}
          operationType={operationType}
          onEditHook={onEditHook}
          onToggleHook={onToggleHook}
        />
      )}
      {editingHook && (
        <EditPanel
          apiName={(apiDesc?.path ?? '').split('/').pop() || ''}
          hasParams={hasParam}
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

export default APIFlowChart

const _ChartWrapper = (
  props: CommonChartProps &
    (
      | {
          globalHookState: NormalGlobalHookState
        }
      | {
          globalHookState: SubscriptionGlobalHookState
        }
    ) & {
      operationType: Readonly<OperationTypeNode | undefined>
    }
) => {
  const {
    globalHookState,
    hookState,
    directiveState,
    operationType,
    apiDesc,
    onEditHook,
    onToggleHook
  } = props
  return (
    <>
      {globalHookState && hookState ? (
        directiveState!.isInternal ? (
          <InternalOperationChart />
        ) : operationType === 'subscription' ? (
          <Suspense>
            <SubscriptionChart
              globalHookState={globalHookState as unknown as SubscriptionGlobalHookState}
              hookState={hookState}
              directiveState={directiveState}
              apiDesc={apiDesc}
              onEditHook={onEditHook}
              onToggleHook={onToggleHook}
            />
          </Suspense>
        ) : (
          <Suspense>
            <FlowChart
              globalHookState={globalHookState as NormalGlobalHookState}
              hookState={hookState}
              directiveState={directiveState}
              apiDesc={apiDesc}
              onEditHook={onEditHook}
              onToggleHook={onToggleHook}
            />
          </Suspense>
        )
      ) : (
        <></>
      )}
    </>
  )
}

const ChartWrapper = React.memo(_ChartWrapper, (prev, next) => isEqual(prev, next))
