import { useEditorContext } from '@graphiql/react'
import type { Monaco } from '@monaco-editor/react'
import Editor, { loader } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'

import { useDebounceEffect } from '@/hooks/debounce'
import { makeSuggest } from '@/lib/helpers/utils'
import { useAPIManager } from '@/pages/workbench/apimanage/[...path]/store'
// import testData from './testdata'

loader.config({ paths: { vs: import.meta.env.BASE_URL + 'modules/monaco-editor/min/vs' } })
const NOT_EDITABLE_DIRECTIVES = [
  'fromClaim',
  'injectGeneratedUUID',
  'injectGeneratedUUID',
  'injectCurrentDatetime',
  'injectEnvironmentVariable',
  'internal'
]

interface VariablesEditorProps {
  apiPath: string
  onRemoveDirective: (argumentIndex: number, directiveIndex: number) => void
}

const VariablesEditor = (props: VariablesEditorProps) => {
  const { schemaAST } = useAPIManager(state => ({
    schemaAST: state.schemaAST
  }))
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
    // @ts-ignore
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
      const storeKey = `_api_args_${props.apiPath}`
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
    100
  )

  useEffect(() => {
    if (props.apiPath) {
      const storeKey = `_api_args_${props.apiPath}`
      try {
        const savedStr = localStorage.getItem(storeKey)
        if (savedStr) {
          try {
            valuesRef.current = JSON.stringify(JSON.parse(savedStr), null, 2)
            editorRef.current?.setValue(valuesRef.current)
          } catch (e) {
            console.error(e)
          }
        }
      } catch (error) {
        //
      }
    }
  }, [props.apiPath, schemaAST]) // 增加schemaAST的监听，以解决切换api时被setValue清空的问题

  return (
    <div className="h-full">
      <Editor
        options={{
          fixedOverflowWidgets: true,
          minimap: { enabled: false }
        }}
        className="h-full min-h-17"
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
          makeSuggest(editor)
        }}
      />
    </div>
  )
}

export default VariablesEditor
