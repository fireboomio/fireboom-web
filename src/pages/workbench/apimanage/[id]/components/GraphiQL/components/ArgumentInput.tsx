import { Checkbox, DatePicker, Input, InputNumber } from 'antd'
import moment from 'moment'

import type { ParameterT } from '@/interfaces/apimanage'

export type InputValueType = string | number | boolean | object | undefined

interface ArgumentInputProps {
  argument: ParameterT
  value?: InputValueType
  onChange?: (v: InputValueType) => void
}

const ArgumentInput = ({ argument, value, onChange }: ArgumentInputProps) => {
  switch (argument.type) {
    case 'Int':
      return (
        <InputNumber
          className="text-xs w-full"
          value={value as number}
          onChange={e => onChange?.(e)}
        />
      )
    case 'String':
      return (
        <Input
          className="text-xs w-full"
          value={value as string}
          onChange={e => onChange?.(e.target.value)}
        />
      )
    case 'Boolean':
      return (
        <Checkbox
          className="text-xs w-full"
          checked={value as boolean}
          onChange={e => {
            onChange?.(e.target.checked)
          }}
        />
      )
    case 'DateTime':
      return (
        <DatePicker
          className="text-xs w-full"
          value={value ? moment(value as string) : null}
          onChange={e => {
            onChange?.(e?.toISOString())
          }}
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
