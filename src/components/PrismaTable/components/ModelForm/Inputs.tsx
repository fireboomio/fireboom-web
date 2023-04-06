import type { SchemaField } from '@paljs/types'
import type { FormItemProps } from 'antd'
import { DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select } from 'antd'
import Search from 'antd/lib/input/Search'
import TextArea from 'antd/lib/input/TextArea'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
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

const String = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  const intl = useIntl()
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <Input disabled={disabled} placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
    </FormItem>
  )
}

const Json = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  const intl = useIntl()
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <TextArea
        disabled={disabled}
        autoSize={{ minRows: 1 }}
        placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
      />
    </FormItem>
  )
}

const Datetime = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  const intl = useIntl()
  const form = Form.useFormInstance()

  const handleDateChange = (dateString: string) => {
    if (!form) return
    form.setFieldValue(name, dayjs(dateString))
  }
  const initialValue = initialValues[name]
  const initialDatetime = initialValue ? dayjs(initialValue as string) : null
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialDatetime}>
      <DatePicker
        placeholder={intl.formatMessage({ defaultMessage: '请选择日期时间' })}
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
    <Radio.Group name={name} disabled={disabled}>
      <Radio value={true}>true</Radio>
      <Radio value={false}>false</Radio>
    </Radio.Group>
  </FormItem>
)

const Int = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  const intl = useIntl()
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <InputNumber
        className="w-full"
        disabled={disabled}
        controls
        precision={0}
        placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
      />
    </FormItem>
  )
}

const Float = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  const intl = useIntl()
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <InputNumber
        className="w-full"
        disabled={disabled}
        controls
        placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
      />
    </FormItem>
  )
}

const Enum = ({ field: { name, required, title, type }, disabled, initialValues }: Props) => {
  const intl = useIntl()
  const {
    schema: { enums }
  } = useTableSchema()
  const enumType = enums.find(e => type === e.name)
  const options = enumType?.fields ?? []
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <Select
        allowClear
        disabled={disabled}
        placeholder={intl.formatMessage({ defaultMessage: '请选择' })}
      >
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
  const intl = useIntl()
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
  if (name !== type) {
    initialObjectValue && form.setFieldValue(type, displayValue)
  }

  useEffect(() => {
    initialObjectValue && setDisplayValue(getDisplayName(initialObjectValue, relationModel!))
  }, [initialObjectValue, relationModel, setDisplayValue])

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
      const msg = intl.formatMessage({ defaultMessage: `请选择 {type} 表关联数据` }, { type: type })
      message.error(msg)
      callback(msg)
    }
  }

  return (
    <>
      <Form.Item
        label={title}
        name={name}
        // style={{ display: 'none' }}
        rules={[{ required, validator: handleValidateObject }]}
        className="w-full"
        // noStyle
      >
        <FormItem noStyle>
          <Search
            disabled={disabled}
            onKeyDown={undefined}
            onPressEnter={undefined}
            readOnly
            allowClear
            placeholder={intl.formatMessage({ defaultMessage: '搜索并关联记录' })}
            value={displayValue}
            enterButton
            onSearch={() => setConnectModalVisible(true)}
          />
        </FormItem>
      </Form.Item>
      <Modal
        width={1200}
        title={intl.formatMessage({ defaultMessage: `关联 {type} 表数据` }, { type })}
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
          redirectToEntityWithFilters={() =>
            void message.warning(intl.formatMessage({ defaultMessage: '此处不支持跳转！' }))
          }
        />
      </Modal>
    </>
  )
}

const Bytes = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      {/* TODO */}
      <FormattedMessage defaultMessage="暂不支持 Blob 类型直接修改" />
      {/* <BlobFile /> */}
    </FormItem>
  )
}

// const BlobFile = ({
//   value,
//   onChange
// }: {
//   value?: ArrayBuffer
//   onChange?: (value: ArrayBuffer) => void
// }) => {
//   return (
//     <input
//       type="file"
//       onChange={e => {
//         const file = e.target.files && e.target.files[0]
//         if (file) {
//           const reader = new FileReader()
//           // 读取文件内容为 uintArrayBuffer
//           reader.readAsArrayBuffer(file)
//           reader.onload = () => {
//             onChange && onChange(reader.result as ArrayBuffer)
//           }
//         }
//       }}
//     />
//   )
// }

const Unsupported = ({ field: { name, required, title }, disabled, initialValues }: Props) => {
  return (
    <FormItem label={title} name={name} required={required} initialValue={initialValues[name]}>
      <FormattedMessage defaultMessage="暂不支持的类型" />
    </FormItem>
  )
}

export const Inputs = {
  String,
  Datetime,
  Boolean,
  Object,
  Enum,
  Int,
  Float,
  Json,
  Bytes,
  Unsupported
}
