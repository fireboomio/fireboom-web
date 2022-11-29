import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { Checkbox, DatePicker, Input, InputNumber, Modal } from 'antd'
import moment from 'moment'
import { useState } from 'react'

import type { ParameterT } from '@/interfaces/apimanage'
import { isInputKey } from '@/lib/helpers/utils'

export type SingleInputValueType = string | number | boolean | object | undefined
export type InputValueType = SingleInputValueType | SingleInputValueType[]

interface ArgumentInputProps {
  argument: ParameterT
  value?: InputValueType
  name?: string
  onChange?: (v: InputValueType) => void
}

const SingleArgumentInput = ({
  type,
  name,
  value,
  onChange
}: Omit<ArgumentInputProps, 'argument'> & { type: string }) => {
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [editorValue, setEditorValue] = useState<string>('')

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
              title="输入变量"
              width={600}
              style={{ top: '10vh' }}
              bodyStyle={{ height: '60vh' }}
              open
              onOk={() => {
                setShowEdit(false)
                let json = {}
                try {
                  json = JSON.parse(editorValue)
                } catch (e) {}
                onChange?.(json)
              }}
              onCancel={() => setShowEdit(false)}
              cancelText="取消"
              okText="确定"
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
                  editor.onKeyUp(e => {
                    if (isInputKey(e.keyCode)) {
                      editor.trigger('', 'editor.action.triggerSuggest', '')
                    }
                  })
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
