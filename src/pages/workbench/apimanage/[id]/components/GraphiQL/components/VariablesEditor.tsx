import { useEditorContext } from '@graphiql/react'
import { message } from 'antd'
import type { VariableDefinitionNode } from 'graphql'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useDebounceEffect } from '@/hooks/debounce'
import { parseParameters } from '@/lib/gql-parser'

import type { InputValueType } from './ArgumentInput'

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
  arguments: ReadonlyArray<VariableDefinitionNode>
  onRemoveDirective: (argumentIndex: number, directiveIndex: number) => void
}

const VariablesEditor = (props: VariablesEditorProps) => {
  const editorContext = useEditorContext()
  const [values, setValues] = useState<Record<string, InputValueType>>({})
  const valuesRef = useRef<Record<string, InputValueType>>({})

  const parsed = useMemo(() => {
    return parseParameters(props.arguments)
  }, [props.arguments])

  const updateValue = (v: InputValueType, key: string) => {
    const target = {
      ...values,
      [key]: v
    }
    setValues(target)
    valuesRef.current = target
  }

  useEffect(() => {
    // 参数改变时要变更输入框的值
    const newValues = props.arguments.reduce<Record<string, InputValueType>>((obj, arg) => {
      const name = arg.variable?.name.value
      if (name) {
        obj[name] = valuesRef.current[name] ?? undefined
      }
      return obj
    }, {})
    setValues(newValues)
    valuesRef.current = newValues
  }, [parsed, props.arguments])

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
        const obj = parsed.reduce<Record<string, any>>((obj, item) => {
          let val = valuesRef.current[item.name]
          if (item.isRequired && (val === '' || val === undefined || val === null)) {
            message.error(`字段 ${item.name} 的参数未提供`)
            throw new Error(`字段 ${item.name} 的参数未提供`)
          }
          if (!['ID', 'Int', 'Float', 'String', 'Boolean', 'DateTime'].includes(item.type)) {
            try {
              val = JSON.parse(val as string)
            } catch (error) {
              message.error(`字段 ${item.name} 的参数输入错误`)
              throw new Error(`字段 ${item.name} 的参数输入错误`)
            }
          }
          obj[item.name] = val
          return obj
        }, {})
        return JSON.stringify(obj)
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
  }, [parsed])

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

  useEffect(() => {
    if (props.apiID && props.arguments.length) {
      const storeKey = `_api_args_${props.apiID}`
      try {
        const savedStr = localStorage.getItem(storeKey)
        if (savedStr) {
          const saved = JSON.parse(savedStr)
          const newValues = props.arguments.reduce<Record<string, InputValueType>>((obj, arg) => {
            const name = arg.variable?.name.value
            if (name) {
              obj[name] = saved[name] ?? undefined
            }
            return obj
          }, {})
          setValues(newValues)
          valuesRef.current = newValues
        }
      } catch (error) {
        //
      }
    }
  }, [props.apiID, props.arguments])

  return <div className="arguments-editor"></div>
}

export default VariablesEditor
