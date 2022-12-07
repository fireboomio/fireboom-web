import type { OperationDefinitionNode } from 'graphql'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDebounceMemo } from '@/hooks/debounce'
import requests from '@/lib/fetchers'
import { parseParameters } from '@/lib/gql-parser'

import { useAPIManager } from '../../store'
import type { FlowChartProps } from './FlowChart'
import FlowChart from './FlowChart'
import InternalOperationChart from './InternalOperation'

type DirectiveState = FlowChartProps['directiveState']
type GlobalState = FlowChartProps['globalHookState']
type HookState = FlowChartProps['hookState']

const APIFlowChart = ({ id }: { id: string }) => {
  const { apiDesc, schemaAST, query, appendToAPIRefresh, dispendToAPIRefresh } = useAPIManager(
    state => ({
      apiDesc: state.apiDesc,
      schemaAST: state.schemaAST,
      query: state.query,
      appendToAPIRefresh: state.appendToAPIRefresh,
      dispendToAPIRefresh: state.dispendToAPIRefresh
    })
  )
  const [globalState, setGlobalState] = useState<GlobalState>()
  const [hookState, setHookState] = useState<HookState>()

  const directiveState = useDebounceMemo(
    () => {
      const defs =
        (schemaAST?.definitions[0] as OperationDefinitionNode | undefined)?.variableDefinitions ??
        []
      const variables = parseParameters(defs)
      const globalDirectives = (
        schemaAST?.definitions[0] as OperationDefinitionNode | undefined
      )?.directives?.map(dir => dir.name.value)
      const allDirectives = variables.reduce<string[]>((arr, item) => {
        arr.push(...(item.directives?.map(dir => dir.name) ?? []))
        return arr
      }, [])
      const state: DirectiveState = {
        isInternal: globalDirectives.includes('internalOperation'),
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

  const loadHook = useCallback(() => {
    if (schemaAST) {
      requests.get(`/operateApi/hooks/${id}`).then(resp => {
        // @ts-ignore
        const globalHooks = resp.globalHooks
        // @ts-ignore
        const operationHooks = resp.operationHooks
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
          }
        })
        const defs =
          (schemaAST.definitions[0] as OperationDefinitionNode | undefined)?.variableDefinitions ??
          []
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
      })
    }
  }, [id, schemaAST])

  useEffect(() => {
    loadHook()
    appendToAPIRefresh(loadHook)
    return () => {
      dispendToAPIRefresh(loadHook)
    }
  }, [appendToAPIRefresh, loadHook, dispendToAPIRefresh])

  return globalState && hookState ? (
    directiveState!.isInternal ? (
      <InternalOperationChart />
    ) : (
      <FlowChart
        globalHookState={globalState}
        hookState={hookState}
        directiveState={directiveState}
        apiSetting={apiDesc!.setting}
      />
    )
  ) : (
    <></>
  )
}

export default APIFlowChart
