import type { AutoCompleteProps, FormItemProps, InputProps, SelectProps } from 'antd'
import { AutoComplete, Form, Input, Select, Space } from 'antd'
import type { ChangeEvent } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { VariableType } from '@/interfaces/datasource'
import { Mode } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'
import useEnvOptions from '@/lib/hooks/useEnvOptions'
import type { ApiDocuments } from '@/services/a2s.namespace'

export interface InputOrFromEnvProps {
  value?: VariableType
  inputProps?: Omit<InputProps, 'value' | 'onChange'>
  envProps?: Omit<AutoCompleteProps, 'value' | 'onChange'>
  onChange?: (data?: VariableType) => void
}

const modeOptions: SelectProps['options'] = [
  { value: Mode.Input, label: '输入值' },
  { value: Mode.Env, label: '环境变量' }
]

const InputOrFromEnv = ({ value, onChange, inputProps, envProps }: InputOrFromEnvProps) => {
  const { mode, setMode } = useContext(InputOrFromEnvContext)
  const envs = useEnvOptions()
  const onSwitchMode = useCallback(
    (e: Mode) => {
      setMode(e)
      onChange?.({ key: '', kind: e, val: '' })
    },
    [onChange]
  )
  const onValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | string) => {
      var value: string = typeof e === 'string' ? e : e.target.value
      onChange?.({
        key: mode == Mode.Env ? value : '',
        kind: mode,
        val: mode == Mode.Env ? '' : value
      })
    },
    [mode, onChange]
  )

  useEffect(() => {
    setMode(value?.kind ?? Mode.Input)
  }, [setMode, value?.kind])

  return (
    <Space.Compact className="!flex">
      <Select className="!w-30" value={mode} options={modeOptions} onChange={onSwitchMode} />
      {mode == Mode.Env ? (
        <AutoComplete
          {...envProps}
          value={value?.key}
          className="flex-1"
          options={envs}
          onChange={onValueChange}
        />
      ) : (
        <Input {...inputProps} className="flex-1" value={value?.val} onChange={onValueChange} />
      )}
    </Space.Compact>
  )
}

export interface InputOrFromEnvWithItemProps
  extends Pick<InputOrFromEnvProps, 'inputProps' | 'envProps'> {
  formItemProps?: Omit<FormItemProps, 'rules'>
  required?: boolean
  rules?: FormItemProps['rules']
  onChange?: (data?: VariableType) => void
}

const InputOrFromEnvWithItem = ({
  formItemProps,
  rules,
  required,
  ...rest
}: InputOrFromEnvWithItemProps) => {
  const [mode, setMode] = useState<Mode>(Mode.Input)
  return (
    <InputOrFromEnvContext.Provider value={{ mode, setMode }}>
      <Form.Item
        {...formItemProps}
        rules={
          mode == Mode.Env
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
  mode: Mode
  setMode: (mode: Mode) => void
}

const InputOrFromEnvContext = createContext<InputOrFromEnvState>(
  // @ts-ignore
  null
)
