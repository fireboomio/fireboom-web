import { Input, Select } from 'antd'
import type React from 'react'

interface PriceInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  style?: React.CSSProperties
  className?: string
  selectClassName?: string
}

export default function UrlInput({
  value,
  onChange,
  placeholder,
  style,
  selectClassName,
  className
}: PriceInputProps) {
  let [, prefix = 'https://', url = ''] = (value ?? '').match(/^(https?:\/\/)(.*$)/) ?? []
  return (
    <Input
      className={className}
      style={style}
      addonBefore={
        <Select
          popupClassName={selectClassName}
          className="select-before w-90px"
          value={prefix}
          onChange={e => onChange?.(`${e}${url}`)}
        >
          <Select.Option value="https://">https://</Select.Option>
          <Select.Option value="http://">http://</Select.Option>
        </Select>
      }
      onChange={e => {
        const { value } = e.target
        if (value.match(/^(https?:\/\/)/)) {
          onChange?.(value)
        } else {
          onChange?.(`${prefix}${e.target.value}`)
        }
      }}
      value={url}
      placeholder={placeholder}
    />
  )
}
