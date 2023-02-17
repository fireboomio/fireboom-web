import type { OperationDefinitionNode, OperationTypeNode } from 'graphql'
import { isEqual } from 'lodash'
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'

import { useDebounceMemo } from '@/hooks/debounce'
import requests from '@/lib/fetchers'
import { parseParameters } from '@/lib/gql-parser'

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

const APIFlowChart = ({ id }: { id: string }) => {
  const {
    apiDesc,
    schemaAST,
    schemaTypeMap,
    query,
    operationType,
    appendToAPIRefresh,
    dispendToAPIRefresh
  } = useAPIManager(state => ({
    apiDesc: state.apiDesc,
    schemaAST: state.schemaAST,
    query: state.query,
    operationType: state.computed.operationType,
    schemaTypeMap: state.schemaTypeMap,
    appendToAPIRefresh: state.appendToAPIRefresh,
    dispendToAPIRefresh: state.dispendToAPIRefresh
  }))
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

  const { data: hookInfo } = useSWRImmutable<any>(
    id ? `/operateApi/hooks/${id}` : null,
    requests.get
  )

  const loadHook = useCallback(() => {
    if (!hookInfo || !schemaAST) {
      return
    }
    // @ts-ignore
    const globalHooks = hookInfo.globalHooks
    // @ts-ignore
    const operationHooks = hookInfo.operationHooks
    setGlobalState({
      onRequest: {
        name: 'onRequest',
        enable: globalHooks.onRequest?.switch ?? false,
        path: globalHooks.onRequest?.path ?? ''
      },
      onResponse: {
        name: 'onResponse',
        enable: globalHooks.onResponse?.switch ?? false,
        path: globalHooks.onResponse?.path ?? ''
      },
      // @ts-ignore
      onConnectionInit: {
        name: 'onConnectionInit',
        enable: globalHooks.onConnectionInit?.switch ?? false,
        path: globalHooks.onConnectionInit?.path ?? ''
      }
    })
    const defs =
      (schemaAST.definitions[0] as OperationDefinitionNode | undefined)?.variableDefinitions ?? []
    setHookState({
      customResolve: {
        name: 'customResolve',
        enable: operationHooks.customResolve.switch,
        path: operationHooks.customResolve.path
      },
      mutatingPostResolve: {
        name: 'mutatingPostResolve',
        enable: operationHooks.mutatingPostResolve.switch,
        path: operationHooks.mutatingPostResolve.path
      },
      mutatingPreResolve: {
        name: 'mutatingPreResolve',
        enable: operationHooks.mutatingPreResolve.switch,
        can: defs?.length > 0 ?? false,
        path: operationHooks.mutatingPreResolve.path
      },
      postResolve: {
        name: 'postResolve',
        enable: operationHooks.postResolve.switch,
        path: operationHooks.postResolve.path
      },
      preResolve: {
        name: 'preResolve',
        enable: operationHooks.preResolve.switch,
        path: operationHooks.preResolve.path
      },
      mockResolve: {
        name: 'mockResolve',
        enable: operationHooks.mockResolve.switch,
        path: operationHooks.mockResolve.path
      }
    })
  }, [id, schemaAST, hookInfo])

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
  }, [id])

  const onEditHook = useCallback((hook: { name: string; path: string }) => {
    setEditingHook(hook)
  }, [])

  return (
    <>
      {apiDesc && schemaAST && (
        <ChartWrapper
          apiSetting={apiDesc!.setting}
          directiveState={directiveState}
          // @ts-ignore
          globalHookState={globalState}
          // @ts-ignore
          hookState={hookState}
          operationType={operationType}
          onEditHook={onEditHook}
        />
      )}
      {editingHook && (
        <EditPanel
          apiName={(apiDesc?.path ?? '').split('/').pop() || ''}
          hasParams={!!(query ?? '').match(/\(\$\w+/)}
          hook={editingHook}
          onClose={() => setEditingHook(null)}
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
  const { globalHookState, hookState, directiveState, operationType, apiSetting, onEditHook } =
    props
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
              apiSetting={apiSetting}
              onEditHook={onEditHook}
            />
          </Suspense>
        ) : (
          <Suspense>
            <FlowChart
              globalHookState={globalHookState as NormalGlobalHookState}
              hookState={hookState}
              directiveState={directiveState}
              apiSetting={apiSetting}
              onEditHook={onEditHook}
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
