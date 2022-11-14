import { Checkbox, DatePicker, Input, InputNumber } from 'antd'
import moment from 'moment'

import type { ParameterT } from '@/interfaces/apimanage'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

type SingleInputValueType = string | number | boolean | object | undefined
export type InputValueType = SingleInputValueType | SingleInputValueType[]

interface ArgumentInputProps {
  argument: ParameterT
  value?: InputValueType
  onChange?: (v: InputValueType) => void
}

const SingleArgumentInput = ({
  type,
  value,
  onChange
}: Omit<ArgumentInputProps, 'argument'> & { type: string }) => {
  switch (type) {
    case 'Int':
      return (
        <InputNumber
          className="text-xs w-full"
          precision={0}
          value={value as number}
          onChange={e => onChange?.(e)}
        />
      )
    case 'Float':
      return (
        <InputNumber
          className="text-xs w-full"
          value={value as number}
          onChange={e => onChange?.(e)}
        />
      )
    case 'String':
    case 'ID':
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

const ArgumentInput = ({ argument, value, onChange }: ArgumentInputProps) => {
  if (!argument.isList) {
    return <SingleArgumentInput type={argument.type} value={value} onChange={onChange} />
  }

  function updateOne(v: SingleInputValueType, index: number) {
    const clone = [...(value as SingleInputValueType[])]
    clone.splice(index, 1, v)
    onChange?.(clone)
  }

  function deleteOne(index: number) {
    const clone = [...(value as SingleInputValueType[])]
    clone.splice(index, 1)
    onChange?.(clone)
  }

  function addOne() {
    const clone = value ? [...(value as SingleInputValueType[]), undefined] : [undefined]
    onChange?.(clone)
  }

  return (
    <div className="flex flex-wrap">
      {(value as SingleInputValueType[] | undefined)?.map((val, index) => (
        <div key={index} className="p-1 group hover:bg-gray-200">
          <SingleArgumentInput
            type={argument.type}
            value={val}
            onChange={v => updateOne(v, index)}
          />
          <DeleteOutlined className="mx-1 invisible group-hover:visible" onClick={() => deleteOne(index)} />
        </div>
      ))}
      <PlusOutlined className="!leading-10 hover:text-primary" onClick={addOne} />
    </div>
  )
}

export default ArgumentInput
