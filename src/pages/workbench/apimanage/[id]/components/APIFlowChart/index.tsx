import type { OperationDefinitionNode } from 'graphql'
import { useEffect, useMemo, useState } from 'react'

import requests from '@/lib/fetchers'
import { parseParameters } from '@/lib/gql-parser'

import { useAPIManager } from '../../hooks'
import type { FlowChartProps } from './FlowChart'
import FlowChart from './FlowChart'

type DirectiveState = FlowChartProps['directiveState']
type GlobalState = FlowChartProps['globalHookState']
type HookState = FlowChartProps['hookState']

const APIFlowChart = ({ id }: { id: string }) => {
  const { schemaAST } = useAPIManager()
  const [globalState, setGlobalState] = useState<GlobalState>()
  const [hookState, setHookState] = useState<HookState>()

  const directiveState = useMemo(() => {
    const defs =
      (schemaAST?.definitions[0] as OperationDefinitionNode | undefined)?.variableDefinitions ?? []
    const variables = parseParameters(defs)
    const allDirectives = variables.reduce<string[]>((arr, item) => {
      arr.push(...(item.directives?.map(dir => dir.name) ?? []))
      return arr
    }, [])
    const state: DirectiveState = {
      fromClaim: allDirectives.includes('fromClaim'),
      injectCurrentDatetime: allDirectives.includes('injectCurrentDatetime'),
      injectEnvironmentVariable: allDirectives.includes('injectEnvironmentVariable'),
      injectGeneratedUUID: allDirectives.includes('injectGeneratedUUID'),
      jsonSchema: allDirectives.includes('jsonSchema'),
      rbac: allDirectives.includes('rbac'),
      transform: allDirectives.includes('transform')
    }
    return state
  }, [schemaAST])

  useEffect(() => {
    requests.get(`/operateApi/hooks/${id}`).then(resp => {
      // @ts-ignore
      const globalHooks = resp.globalHooks
      // @ts-ignore
      const operationHooks = resp.operationHooks
      setGlobalState({
        onRequest: { enable: globalHooks.onRequest.switch, path: globalHooks.onRequest.path },
        onResponse: { enable: globalHooks.onResponse.switch, path: globalHooks.onResponse.path }
      })
      setHookState({
        customResolve: {
          enable: operationHooks.customResolve.switch,
          path: operationHooks.customResolve.path
        },
        mutatingPostResolve: {
          enable: operationHooks.mutatingPostResolve.switch,
          path: operationHooks.mutatingPostResolve.path
        },
        mutatingPreResolve: {
          enable: operationHooks.mutatingPreResolve.switch,
          path: operationHooks.mutatingPreResolve.path
        },
        postResolve: {
          enable: operationHooks.postResolve.switch,
          path: operationHooks.postResolve.path
        },
        preResolve: {
          enable: operationHooks.preResolve.switch,
          path: operationHooks.preResolve.path
        },
        mockResolve: {
          enable: operationHooks.mockResolve.switch,
          path: operationHooks.mockResolve.path
        }
      })
    })
  }, [id])

  return (
    globalState &&
    hookState && (
      <FlowChart
        globalHookState={globalState}
        hookState={hookState}
        directiveState={directiveState}
      />
    )
  )
}

export default APIFlowChart
