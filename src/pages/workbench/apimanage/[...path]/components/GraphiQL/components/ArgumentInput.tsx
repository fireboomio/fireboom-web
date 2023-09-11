import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { Checkbox, DatePicker, Input, InputNumber, Modal } from 'antd'
import dayjs from 'dayjs'
import type { IntrospectionEnumValue } from 'graphql'
import { useState } from 'react'
import { useIntl } from 'react-intl'

import type { ParameterT } from '@/interfaces/apimanage'
import { makeSuggest } from '@/lib/helpers/utils'

export type SingleInputValueType = string | number | boolean | object | undefined
export type InputValueType = SingleInputValueType | SingleInputValueType[]

interface ArgumentInputProps {
  argument: ParameterT
  value?: InputValueType
  name?: string
  enums: readonly IntrospectionEnumValue[] | null
  onChange?: (v: InputValueType) => void
}

const SingleArgumentInput = ({
  type,
  name,
  value,
  enums,
  onChange
}: Omit<ArgumentInputProps, 'argument'> & {
  type: string
}) => {
  const intl = useIntl()
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [editorValue, setEditorValue] = useState<string>('')

  if (enums) {
    // 使用ant的Select会卡
    return (
      <select
        className="border border-solid rounded-sm outline-none border-[#d9d9d9] h-7 text-xs text-sm w-full max-w-50 py-1 px-2 focus-visible:border-[#f5587a] focus-visible:shadow"
        placeholder={type}
        value={value as string}
        onChange={e => {
          onChange?.(e.target.value)
        }}
      >
        <option value={undefined}></option>
        {enums.map(item => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    )
  }

  switch (type) {
    case 'Int':
    case 'BigInt':
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
          value={value ? dayjs(value as string) : null}
          onChange={e => {
            onChange?.(e?.toISOString())
          }}
        />
      )
    default:
      if (/Decimal$/.test(type)) {
        return (
          <Input
            className="text-xs w-full"
            value={value as string}
            onChange={e => onChange?.(e.target.value)}
          />
        )
      }
      return (
        <>
          <Input.TextArea
            className="text-xs"
            value={typeof value === 'object' ? JSON.stringify(value) : (value as string)}
            // disabled
            onClick={() => {
              setEditorValue(
                typeof value === 'object' ? JSON.stringify(value, null, 2) : (value as string)
              )
              setShowEdit(true)
            }}
            // onChange={e => onChange?.(e.target.value)}
          />
          {showEdit && (
            <Modal
              mask={false}
              title={intl.formatMessage({ defaultMessage: '输入变量' })}
              width={600}
              style={{ top: '10vh' }}
              bodyStyle={{ height: '60vh' }}
              open
              onOk={() => {
                setShowEdit(false)
                let json = {}
                try {
                  json = JSON.parse(editorValue)
                } catch (e) {
                  //
                }
                onChange?.(json)
              }}
              onCancel={() => setShowEdit(false)}
              cancelText={intl.formatMessage({ defaultMessage: '取消' })}
              okText={intl.formatMessage({ defaultMessage: '确定' })}
            >
              <Editor
                options={{
                  fixedOverflowWidgets: true,
                  minimap: { enabled: false },
                  lineNumbers: 'off',
                  lineDecorationsWidth: 0,
                  glyphMargin: false
                }}
                defaultLanguage="json"
                defaultPath={`operation_${name}.json`}
                onChange={v => setEditorValue(v ?? '')}
                beforeMount={monaco => {
                  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                    ...monaco.languages.json.jsonDefaults.diagnosticsOptions
                  })
                  const uri = monaco.Uri.parse(`operation_${name}.json`)
                  // 如果已经有重名model则释放
                  monaco.editor.getModel(uri)?.dispose()
                  // 创建model
                  monaco.editor.createModel(editorValue, 'json', uri)
                }}
                onMount={editor => {
                  makeSuggest(editor)
                }}
              />
            </Modal>
          )}
        </>
      )
  }
}

const ArgumentInput = ({ argument, value, onChange }: ArgumentInputProps) => {
  if (!argument.isList) {
    return (
      <SingleArgumentInput
        name={argument.name}
        type={argument.type}
        enums={argument.enums}
        value={value}
        onChange={onChange}
      />
    )
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
        <div key={index} className="flex w-full p-1 group items-center hover:bg-gray-200">
          <SingleArgumentInput
            type={argument.type}
            name={argument.name}
            enums={argument.enums}
            value={val}
            onChange={v => updateOne(v, index)}
          />
          <DeleteOutlined
            className="mx-1 invisible hover:text-red-500 group-hover:visible"
            onClick={() => deleteOne(index)}
          />
        </div>
      ))}
      <PlusOutlined className="!leading-10 hover:text-primary" onClick={addOne} />
    </div>
  )
}

export default ArgumentInput
