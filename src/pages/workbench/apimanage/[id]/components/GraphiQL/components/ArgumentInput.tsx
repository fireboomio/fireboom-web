import { Input, InputNumber } from 'antd'

import type { ParameterT } from '@/interfaces/apimanage'

export type InputValueType = string | number | object

interface ArgumentInputProps {
  argument: ParameterT
  value?: InputValueType
  onChange?: (v: InputValueType) => void
}

const ArgumentInput = ({ argument, value, onChange }: ArgumentInputProps) => {
  switch (argument.type) {
    case 'Int':
      return (
        <InputNumber className="text-xs" value={value as number} onChange={e => onChange?.(e)} />
      )
    case 'String':
      return (
        <Input
          className="text-xs"
          value={value as string}
          onChange={e => onChange?.(e.target.value)}
        />
      )

    default:
      return (
        <Input.TextArea
          className="text-xs"
          value={value as string}
          onChange={e => onChange?.(e.target.value)}
        />
      )
  }
}

export default ArgumentInput
