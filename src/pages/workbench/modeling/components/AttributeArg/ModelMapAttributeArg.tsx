import { WarningOutlined } from '@ant-design/icons'
import type { AttributeArgument } from '@mrleebo/prisma-ast'
import { Input, Popover } from 'antd'
import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import type { AttributeHandlersProp } from '@/lib/helpers/PrismaSchemaProperties'

import AttributeArgHelper from './AttributeArgHelper'

const errorPromptContainer = (errorMessage: string) => {
  return (
    <Popover content={<div className="text-red-500">{errorMessage}</div>} trigger="hover">
      <WarningOutlined />
    </Popover>
  )
}

const ModelMapAttributeArg = ({ args, updateAttrArgs }: AttributeHandlersProp) => {
  const intl = useIntl()
  const initialValue = AttributeArgHelper.extractNormalAttrArgs(args)
  const [isEditing, setEditing] = useImmer(false)
  const [value, setValue] = useImmer<string>(initialValue)
  const [errorPrompt, setErrorPrompt] = useImmer<ReactNode>(<></>)
  const [inputStatus, setInputStatus] = useImmer<'error' | 'warning' | ''>('')

  const commit = () => {
    if (!value || value[0] !== '"' || value[value.length - 1] !== '"') {
      setInputStatus('error')
      setErrorPrompt(
        errorPromptContainer(
          intl.formatMessage({ defaultMessage: '请输入合法字符串，使用双引号包括' })
        )
      )
      setValue(initialValue)
      return false
    }
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
    setInputStatus('')
    setErrorPrompt(<></>)
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
          prefix={errorPrompt}
          status={inputStatus}
          onBlur={commit}
          placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
          value={value}
          onPressEnter={commit}
          bordered={false}
          className="w-max pl-0"
        />
      ) : (
        <div className="w-max text-[#ECA160]" onClick={handleFocus}>
          {value ? value : intl.formatMessage({ defaultMessage: '请输入' })}
        </div>
      )}
      <span>)</span>
    </div>
  )
}

export default ModelMapAttributeArg
