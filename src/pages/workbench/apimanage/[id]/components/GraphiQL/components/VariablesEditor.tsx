import { useEditorContext } from '@graphiql/react'
import type { Monaco } from '@monaco-editor/react'
import Editor, { loader } from '@monaco-editor/react'
import type { JSONSchema6 } from 'json-schema'
import { useEffect, useRef, useState } from 'react'

import { useDebounceEffect } from '@/hooks/debounce'
import { setupSchema } from '@/lib/helpers/jsonManage'

import type { InputValueType } from './ArgumentInput'
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
  jsonSchema: JSONSchema6
  onRemoveDirective: (argumentIndex: number, directiveIndex: number) => void
}

const VariablesEditor = (props: VariablesEditorProps) => {
  const editorContext = useEditorContext()
  const [values, setValues] = useState<Record<string, InputValueType>>({})
  const valuesRef = useRef<Record<string, InputValueType>>({})
  const monacoRef = useRef<Monaco>()
  const editorRef = useRef<any>()

  useEffect(() => {
    console.log(333, props.jsonSchema)
    if (!monacoRef.current) {
      return
    }
    console.log(222)
    setupSchema(monacoRef.current, 'operation.json', props.jsonSchema, '')
  }, [props.jsonSchema])

  const updateValue = (v: InputValueType, key: string) => {
    const target = {
      ...values,
      [key]: v
    }
    setValues(target)
    valuesRef.current = target
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
        // 暂时只支持清空
        if (!v) {
          setValues({})
          valuesRef.current = {}
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDebounceEffect(
    () => {
      const storeKey = `_api_args_${props.apiID}`
      if (Object.keys(values).length && Object.keys(values).some(k => !!values[k])) {
        localStorage.setItem(storeKey, JSON.stringify(values))
      }
    },
    [values],
    1000
  )

  return (
    <div className="h-full">
      <Editor
        className="h-full"
        defaultLanguage="json"
        defaultPath="test.json"
        beforeMount={monaco => {
          monacoRef.current = monaco
          if (props.jsonSchema) {
            console.log('111')
            setupSchema(monacoRef.current, 'operation.json', props.jsonSchema, '')
          }
        }}
        onMount={editor => {
          editorRef.current = editor
        }}
      />
    </div>
  )
}

export default VariablesEditor
