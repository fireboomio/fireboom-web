import { useEditorContext } from '@graphiql/react'
import type { Monaco } from '@monaco-editor/react'
import Editor, { loader } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'

import { useDebounceEffect } from '@/hooks/debounce'
import { isInputKey } from '@/lib/helpers/utils'
// import testData from './testdata'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })
const NOT_EDITABLE_DIRECTIVES = [
  'fromClaim',
  'injectGeneratedUUID',
  'injectGeneratedUUID',
  'injectCurrentDatetime',
  'injectEnvironmentVariable',
  'internal'
]

interface VariablesEditorProps {
  apiID: string
  onRemoveDirective: (argumentIndex: number, directiveIndex: number) => void
}

const VariablesEditor = (props: VariablesEditorProps) => {
  const editorContext = useEditorContext()
  const [values, setValues] = useState<string>('')
  const valuesRef = useRef<string>('')
  const monacoRef = useRef<Monaco>()
  const editorRef = useRef<any>()
  const updateValue = (v: string) => {
    setValues(v)
    valuesRef.current = v
  }
  useEffect(() => {
    editorContext!.setVariableEditor({
      options: {
        lint: { variableToType: '' },
        hintOptions: { variableToType: '' }
      },
      state: {
        lint: {
          linterOptions: { variableToType: '' }
        }
      },
      getValue() {
        return editorRef.current?.getValue()
      },
      setValue(v: string) {
        return editorRef.current?.setValue(v)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDebounceEffect(
    () => {
      const storeKey = `_api_args_${props.apiID}`
      if (values) {
        try {
          JSON.parse(values)
          localStorage.setItem(storeKey, values)
        } catch (_e) {
          // ignore
        }
      }
    },
    [values],
    1000
  )

  useEffect(() => {
    if (props.apiID) {
      const storeKey = `_api_args_${props.apiID}`
      try {
        const savedStr = localStorage.getItem(storeKey)
        if (savedStr) {
          const saved = savedStr
          try {
            valuesRef.current = JSON.stringify(JSON.parse(saved), null, 2)
            editorRef.current?.setValue(saved)
          } catch (e) {
            console.error(e)
          }
        }
      } catch (error) {
        //
      }
    }
  }, [props.apiID])

  return (
    <div className="h-full">
      <Editor
        options={{
          fixedOverflowWidgets: true,
          minimap: { enabled: false }
        }}
        className="h-full"
        defaultLanguage="json"
        defaultPath="operation.json"
        onChange={v => updateValue(v ?? '')}
        beforeMount={monaco => {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            ...monaco.languages.json.jsonDefaults.diagnosticsOptions
          })
          const uri = monaco.Uri.parse('operation.json')
          // 如果已经有重名model则释放
          monaco.editor.getModel(uri)?.dispose()
          // 创建model
          monaco.editor.createModel('', 'json', uri)
          monacoRef.current = monaco
        }}
        onMount={editor => {
          editorRef.current = editor
          if (valuesRef.current) {
            editor.setValue(valuesRef.current)
          }
          editor.onKeyUp(e => {
            if (isInputKey(e.keyCode)) {
              editor.trigger('', 'editor.action.triggerSuggest', '')
            }
          })
        }}
      />
    </div>
  )
}

export default VariablesEditor
