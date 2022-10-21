import type { AttributeArgument } from '@mrleebo/prisma-ast'
import { Input } from 'antd'
import { useImmer } from 'use-immer'

import AttributeArgHelper from '@/components/PrismaDesign/components/AttributeArg/AttributeArgHelper'
import type { AttributeHandlersProp } from '@/lib/helpers/PrismaSchemaProperties'

const FieldNormalAttributeArg = ({ args, updateAttrArgs }: AttributeHandlersProp) => {
  const initialValue = AttributeArgHelper.extractNormalAttrArgs(args)
  const [isEditing, setEditing] = useImmer(false)
  const [value, setValue] = useImmer<string>(initialValue)

  const commit = () => {
    setEditing(false)
    const newArgs: AttributeArgument[] = [
      {
        type: 'attributeArgument',
        value: value
      }
    ]
    updateAttrArgs(newArgs)
  }

  const onChange = (newStr: string) => {
    setValue(newStr)
  }

  const handleFocus = () => {
    setEditing(true)
  }
  return (
    <div className="flex">
      <span>(</span>
      {isEditing ? (
        <Input
          onChange={e => onChange(e.target.value)}
          onBlur={commit}
          placeholder="请输入"
          value={value}
          onPressEnter={commit}
          bordered={false}
          className="w-max pl-0"
        />
      ) : (
        <span className="text-[#ECA160] w-max" onClick={handleFocus}>
          {value ? value : '请输入'}
        </span>
      )}
      <span>)</span>
    </div>
  )
}

export default FieldNormalAttributeArg
