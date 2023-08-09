import { VariableKind } from '@/interfaces/common'
import type { ApiDocuments } from '@/services/a2s.namespace'

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

export function getConfigurationVariableRender(variable?: ApiDocuments.ConfigurationVariable) {
  if (!variable) return ''
  return variable.kind === VariableKind.Static
    ? variable.staticVariableContent
    : variable.kind === VariableKind.Env
    ? `env(${variable.environmentVariableName})`
    : variable.placeholderVariableName
}
