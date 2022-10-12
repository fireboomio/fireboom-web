import { Input, InputNumber } from 'antd'

import { ParameterT } from '@/interfaces/apimanage'

export type InputValueType = string | number | object

interface ArgumentInputProps {
  argument: ParameterT
  value?: InputValueType
  onChange?: (v: InputValueType) => void
}

const ArgumentInput = ({ argument, value, onChange }: ArgumentInputProps) => {

  switch (argument.type) {
    case 'Int':
      return <InputNumber value={value as number} onChange={e => onChange?.(e)} />
    case 'String':
      return <Input value={value as string} onChange={e => onChange?.(e)} />
    
    default:
      console.log(argument.type)
      return <>123</>
  }
}

export default ArgumentInput