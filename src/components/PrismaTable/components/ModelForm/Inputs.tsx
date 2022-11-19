import type { SchemaField } from '@paljs/types'
import type { FormItemProps } from 'antd'
import { DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select } from 'antd'
import Search from 'antd/lib/input/Search'
import TextArea from 'antd/lib/input/TextArea'
import moment from 'moment'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import DynamicTable from '@/components/PrismaTable/components/DynamicTable'
import type { FilterState } from '@/components/PrismaTable/libs/types'
import { getDisplayName } from '@/components/PrismaTable/libs/utils'
import useTableSchema from '@/lib/hooks/useTableSchema'

interface SelfFormItemProps {
  children: JSX.Element
}

export const FormItem = ({
  label,
  children,
  name,
  required,
  initialValue
}: SelfFormItemProps & FormItemProps) => {
  return (
    <Form.Item
      className="w-full"
      label={label}
      name={name}
      rules={[{ required }]}
      initialValue={initialValue}
    >
      {children}
    </Form.Item>
  )
}

interface Props {
  field: SchemaField
  disabled: boolean
  initialValues: Record<string, any>
  namespace: string
}

const Default = ({ field: { name, required, title }, disabled, initialValues }: Props) => (
  <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
    <Input disabled={disabled} />
  </FormItem>
)

const Json = ({ field: { name, required, title }, disabled, initialValues }: Props) => (
  <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
    <TextArea disabled={disabled} />
  </FormItem>
)

const Datetime = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  const form = Form.useFormInstance()

  const handleDateChange = (dateString: string) => {
    if (!form) return
    form.setFieldValue(name, moment(dateString))
  }
  const initialValue = initialValues[name]
  const initialDatetime = initialValue ? moment(initialValue as string) : null
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialDatetime}>
      <DatePicker
        disabled={disabled}
        className="w-full"
        showTime
        onChange={(_, dateString) => handleDateChange(dateString)}
      />
    </FormItem>
  )
}

const Boolean = ({ field: { name, required, title }, disabled, initialValues }: Props) => (
  <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
    <Radio.Group name="radiogroup" disabled={disabled}>
      <Radio value={true}>true</Radio>
      <Radio value={false}>false</Radio>
    </Radio.Group>
  </FormItem>
)

const Number = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <InputNumber className="w-full" disabled={disabled} controls />
    </FormItem>
  )
}

const Enum = ({ field: { name, required, title, type }, disabled, initialValues }: Props) => {
  const {
    schema: { enums }
  } = useTableSchema()
  const enumType = enums.find(e => type === e.name)
  const options = enumType?.fields ?? []
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <Select allowClear disabled={disabled}>
        {options.map((enumValue, idx) => (
          <Select.Option key={idx} value={enumValue}>
            {enumValue}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  )
}

const Object = ({
  field: { name, required, title, type },
  namespace,
  disabled,
  initialValues
}: Props) => {
  const form = Form.useFormInstance()
  const initialObjectValue = initialValues[name] as Record<string, any>

  const [displayValue, setDisplayValue] = useImmer<string | undefined>(undefined)
  const [connectModalVisible, setConnectModalVisible] = useImmer<boolean>(false)
  const [filters, setFilters] = useImmer<FilterState[]>([])
  const {
    schema: { models }
  } = useTableSchema()
  const relationModel = models.find(m => m.id === type)
  const relationModelIdField = relationModel?.fields.find(f => f.isId)
  initialObjectValue && form.setFieldValue(name, initialObjectValue[relationModelIdField!.name])
  initialObjectValue && form.setFieldValue(type, displayValue)

  useEffect(() => {
    initialObjectValue && setDisplayValue(getDisplayName(initialObjectValue, relationModel!))
  }, [initialObjectValue])

  const handleConnect = (record: Record<string, any>) => {
    const connectedValue = record[relationModelIdField!.name]
    setTimeout(() => form.setFieldValue(name, connectedValue), 50)
    setDisplayValue(connectedValue ? getDisplayName(record, relationModel!) : undefined)
    setConnectModalVisible(false)
  }

  const handleValidateObject = (_: unknown, value: unknown, callback: (error?: string) => void) => {
    if (!required || value) {
      callback()
    } else {
      void message.error(`请选择 ${type} 表关联数据`)!
      callback('Field is required!')
    }
  }

  return (
    <>
      <Form.Item
        label={title}
        name={name}
        style={{ display: 'none' }}
        rules={[{ required }, { validator: handleValidateObject }]}
      >
        {<Input />}
      </Form.Item>
      <FormItem label={title} required={required} className="w-full" noStyle>
        <Search
          disabled={disabled}
          onKeyDown={undefined}
          onPressEnter={undefined}
          readOnly
          allowClear
          placeholder="搜索并关联记录"
          value={displayValue}
          enterButton
          onSearch={() => setConnectModalVisible(true)}
        />
      </FormItem>
      <Modal
        width={1200}
        title={`关联 ${type} 表数据`}
        open={connectModalVisible}
        footer={false}
        destroyOnClose
        onCancel={() => setConnectModalVisible(false)}
      >
        <DynamicTable
          model={type}
          namespace={namespace}
          usage="connection"
          handleConnect={handleConnect}
          initialFilters={filters}
          updateInitialFilters={setFilters}
          connectedRecord={initialObjectValue}
          redirectToEntityWithFilters={() => void message.warning('此处不支持跳转！')}
        />
      </Modal>
    </>
  )
}

export const Inputs = {
  Default,
  Datetime,
  Boolean,
  Object,
  Enum,
  Number,
  Json
}
