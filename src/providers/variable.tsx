import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useCallback } from 'react'
import useSWRImmutable from 'swr/immutable'

import { VariableKind } from '@/interfaces/common'
import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

import { useEnv } from './env'

export function getConfigurationVariableField(
  variable: number | ApiDocuments.ConfigurationVariable
) {
  const kind = typeof variable === 'number' ? variable : variable.kind
  return kind === VariableKind.Static
    ? 'staticVariableContent'
    : kind === VariableKind.Env
    ? 'environmentVariableName'
    : 'placeholderVariableName'
}

export function getConfigurationVariableRender(
  variable?: ApiDocuments.ConfigurationVariable,
  opts?: {
    visible: boolean
    onVisibleChange: (visible: boolean) => void
    enableVisible: boolean
  }
) {
  if (!variable) return ''
  if (variable.kind === VariableKind.Env) {
    return `env(${variable.environmentVariableName})`
  }
  function getText() {
    return variable!.kind === VariableKind.Static
      ? variable!.staticVariableContent
      : variable!.placeholderVariableName
  }

  if (!opts || !opts.enableVisible) {
    return getText()
  }
  return opts.visible ? (
    <div className="inline-flex items-center">
      {getText()}
      <EyeOutlined className="cursor-pointer ml-4" onClick={() => opts.onVisibleChange?.(false)} />
    </div>
  ) : (
    <div className="inline-flex items-center">
      ********
      <EyeInvisibleOutlined
        className="cursor-pointer ml-4"
        onClick={() => opts.onVisibleChange?.(true)}
      />
    </div>
  )
}

export function useConfigurationVariable() {
  const { envs } = useEnv()
  const getConfigurationValue = useCallback(
    (variable: ApiDocuments.ConfigurationVariable) => {
      if (variable.kind === VariableKind.Static) {
        return variable.staticVariableContent
      }
      if (variable.kind === VariableKind.Env) {
        if (!envs || !variable.environmentVariableName) {
          return ''
        }
        return envs[variable.environmentVariableName]
      }
      return variable.placeholderVariableName
    },
    [envs]
  )
  return { getConfigurationValue }
}
