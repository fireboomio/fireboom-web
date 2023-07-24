import type { JSONValue } from '@antv/x6'
import Editor from '@swordjs/monaco-editor-react'
import { Input, message, Modal } from 'antd'
import type { JSONSchema7 } from 'json-schema'
import type { languages } from 'monaco-editor'
import { useEffect, useState } from 'react'

import { makeSuggest } from '@/lib/helpers/utils'

interface JsonEditorProps {
  // json schema url格式
  schemaUrl?: string
  // json 对象格式
  schema?: JSONSchema7
  value?: JSONValue | string
  onChange?: (value?: JSONValue) => void
}

const JsonEditor = ({ schema, schemaUrl, value, onChange }: JsonEditorProps) => {
  const [editorValue, setEditorValue] = useState<string>('')
  const [showEdit, setShowEdit] = useState<boolean>(false)

  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        setEditorValue(value)
      } else {
        try {
          setEditorValue(JSON.stringify(value))
        } catch (error) {
          message.warning('输入对象不合法')
        }
      }
    } else {
      setEditorValue('')
    }
  }, [value])

  const _onChange = (v?: string) => {
    if (v) {
      setEditorValue(v)
      try {
        onChange?.(JSON.parse(v))
      } catch (error) {
        //
      }
    } else {
      setEditorValue('')
      onChange?.()
    }
  }

  return (
    <>
      <Input.TextArea
        className="text-xs"
        value={editorValue}
        autoSize={{ minRows: 3, maxRows: 12 }}
        // disabled
        onClick={() => {
          setShowEdit(true)
        }}
        onChange={e => _onChange(e.target.value)}
      />
      {showEdit && (
        <Modal
          mask={false}
          title={null}
          width={720}
          style={{ top: '10vh' }}
          bodyStyle={{ height: '60vh' }}
          open
          onOk={() => {
            setShowEdit(false)
            _onChange?.(editorValue)
          }}
          onCancel={() => setShowEdit(false)}
        >
          <Editor
            options={{
              fixedOverflowWidgets: true,
              minimap: { enabled: false },
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              glyphMargin: false,
              formatOnPaste: true,
              formatOnType: true
            }}
            defaultLanguage="json"
            defaultPath='fb://json/editor.json'
            onChange={v => _onChange(v)}
            beforeMount={monaco => {
              const schemas: languages.json.DiagnosticsOptions['schemas'] = []
              if (schema) {
                schemas.push({
                  uri: 'http://fb/schema.json',
                  schema: schema
                })
              }
              if (schemaUrl) {
                schemas.push({
                  uri: schemaUrl
                })
              }
              monaco.languages.json.jsonDefaults.setDiagnosticsOptions(
                !schemaUrl && !schema
                  ? {
                      ...monaco.languages.json.jsonDefaults.diagnosticsOptions
                    }
                  : {
                      validate: true,
                      schemas: schemas
                    }
              )

              const uri = monaco.Uri.parse(`fb://json/editor.json`)
              // 如果已经有重名model则释放
              monaco.editor.getModel(uri)?.dispose()
              if (editorValue) {
                // monaco.editor.getModel(uri)?.setValue(editorValue)
                // 创建model
                monaco.editor.createModel(editorValue, 'json', uri)
              }
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

export default JsonEditor
