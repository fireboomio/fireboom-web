import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

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
