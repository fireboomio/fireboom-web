import type { AutoCompleteProps, FormItemProps, InputProps, SelectProps } from 'antd'
import { AutoComplete, Form, Input, Select, Space } from 'antd'
import type { ChangeEvent } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { VariableKind } from '@/interfaces/common'
import useEnvOptions from '@/lib/hooks/useEnvOptions'
import type { ApiDocuments } from '@/services/a2s.namespace'

export interface InputOrFromEnvProps {
  value?: ApiDocuments.ConfigurationVariable
  inputProps?: Omit<InputProps, 'value' | 'onChange'>
  envProps?: Omit<AutoCompleteProps, 'value' | 'onChange'>
  onChange?: (data?: ApiDocuments.ConfigurationVariable) => void
}

const modeOptions: SelectProps['options'] = [
  { value: VariableKind.Static, label: '输入值' },
  { value: VariableKind.Env, label: '环境变量' }
]

const InputOrFromEnv = ({ value, onChange, inputProps, envProps }: InputOrFromEnvProps) => {
  const { kind: kind, setKind: setKind } = useContext(InputOrFromEnvContext)
  const envs = useEnvOptions()
  const onSwitchMode = useCallback(
    (e: VariableKind) => {
      setKind(e)
      onChange?.(
        e === VariableKind.Env
          ? { kind: e, environmentVariableName: '' }
          : { kind: e, staticVariableContent: '' }
      )
    },
    [onChange, setKind]
  )
  const onValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | string) => {
      var value: string = typeof e === 'string' ? e : e.target.value
      onChange?.(
        kind === VariableKind.Env
          ? { kind: kind, environmentVariableName: value }
          : { kind: kind, staticVariableContent: value }
      )
    },
    [kind, onChange]
  )

  useEffect(() => {
    setKind((value?.kind as VariableKind) ?? VariableKind.Static)
  }, [setKind, value?.kind])

  return (
    <Space.Compact className="!flex">
      <Select className="!w-30" value={kind} options={modeOptions} onChange={onSwitchMode} />
      {kind == VariableKind.Env ? (
        <AutoComplete
          {...envProps}
          value={value?.environmentVariableName}
          className="flex-1"
          options={envs}
          onChange={onValueChange}
        />
      ) : (
        <Input
          {...inputProps}
          className="flex-1"
          value={value?.staticVariableContent}
          onChange={onValueChange}
        />
      )}
    </Space.Compact>
  )
}

export interface InputOrFromEnvWithItemProps
  extends Pick<InputOrFromEnvProps, 'inputProps' | 'envProps'> {
  formItemProps?: Omit<FormItemProps, 'rules'>
  required?: boolean
  rules?: FormItemProps['rules']
  onChange?: (data?: ApiDocuments.ConfigurationVariable) => void
}

const InputOrFromEnvWithItem = ({
  formItemProps,
  rules,
  required,
  ...rest
}: InputOrFromEnvWithItemProps) => {
  const [kind, setKind] = useState<VariableKind>(VariableKind.Static)
  return (
    <InputOrFromEnvContext.Provider value={{ kind, setKind }}>
      <Form.Item
        {...formItemProps}
        rules={
          kind == VariableKind.Env
            ? required
              ? [
                  {
                    required: true,
                    message: '请选择一个环境变量或者手动输入'
                  }
                ]
              : undefined
            : required
            ? [
                ...(rules ?? []),
                {
                  required: true,
                  message: '请输入'
                }
              ]
            : rules
        }
      >
        <InputOrFromEnv {...rest} />
      </Form.Item>
    </InputOrFromEnvContext.Provider>
  )
}

export default InputOrFromEnvWithItem

interface InputOrFromEnvState {
  kind: VariableKind
  setKind: (kind: VariableKind) => void
}

const InputOrFromEnvContext = createContext<InputOrFromEnvState>(
  // @ts-ignore
  null
)
