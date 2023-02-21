import { useEditorContext } from '@graphiql/react'
import { message, Tooltip } from 'antd'
import type { VariableDefinitionNode } from 'graphql'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { CircleCloseOutlined } from '@/components/icons'
import { useDebounceEffect } from '@/hooks/debounce'
import { parseParameters } from '@/lib/gql-parser'

import { useAPIManager } from '../../../store'
import requiredIcon from '../assets/required.svg'
import type { InputValueType, SingleInputValueType } from './ArgumentInput'
import ArgumentInput from './ArgumentInput'

// 测试的时候还是得填
const NOT_EDITABLE_DIRECTIVES: string[] = [
  // 'fromClaim',
  // 'injectGeneratedUUID',
  // 'injectGeneratedUUID',
  // 'injectCurrentDatetime',
  // 'injectEnvironmentVariable',
  // 'internal'
]

interface ArgumentsEditorProps {
  apiID: string
  arguments: ReadonlyArray<VariableDefinitionNode>
  onRemoveDirective: (argumentIndex: number, directiveIndex: number) => void
}

const ArgumentsEditor = (props: ArgumentsEditorProps) => {
  const intl = useIntl()
  const editorContext = useEditorContext()
  const { schemaTypeMap } = useAPIManager(state => ({
    schemaTypeMap: state.schemaTypeMap
  }))
  const [values, setValues] = useState<Record<string, InputValueType>>({})
  const valuesRef = useRef<Record<string, InputValueType>>({})

  const parsed = useMemo(() => {
    return parseParameters(props.arguments, schemaTypeMap)
  }, [props.arguments, schemaTypeMap])

  const hasDirective = parsed?.some(item => item.directives?.length)

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
          const requiredMsg = intl.formatMessage(
            { defaultMessage: '字段 {name} 的参数未提供' },
            { name: item.name }
          )
          const notValidMsg = intl.formatMessage(
            { defaultMessage: '字段 {name} 的参数输入错误' },
            { name: item.name }
          )
          if (item.isRequired) {
            if (item.isList) {
              if ((val as SingleInputValueType[]).length) {
                message.error(requiredMsg)
                throw new Error(requiredMsg)
              }
            } else if (val === '' || val === undefined || val === null) {
              message.error(requiredMsg)
              throw new Error(requiredMsg)
            }
          }
          if (item.isList) {
            if (val) {
              val = (val as SingleInputValueType[]).map(vItem => {
                if (!['ID', 'Int', 'Float', 'String', 'Boolean', 'DateTime'].includes(item.type)) {
                  if (item.enums) {
                    return vItem
                  }
                  if (typeof vItem === 'string') {
                    try {
                      return JSON.parse(vItem as string)
                    } catch (error) {
                      message.error(notValidMsg)
                      throw new Error(notValidMsg)
                    }
                  }
                  return vItem
                }
              })
            }
          } else {
            if (
              !['ID', 'Int', 'Float', 'String', 'Boolean', 'DateTime'].includes(item.type) &&
              !item.enums
            ) {
              if (val && typeof val === 'string') {
                try {
                  val = JSON.parse(val)
                } catch (error) {
                  message.error(notValidMsg)
                  throw new Error(notValidMsg)
                }
              }
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

  return (
    <div className="arguments-editor max-h-50vh overflow-y-scroll">
      <table className="min-w-120">
        <thead>
          <tr>
            <th style={{ width: '15%', maxWidth: '80px' }}>
              <FormattedMessage defaultMessage="参数" />
            </th>
            <th style={{ width: '20%', maxWidth: '112px' }}>
              <FormattedMessage defaultMessage="类型" />{' '}
            </th>
            <th style={{ width: '56px' }}>
              <FormattedMessage defaultMessage="必填" />
            </th>
            <th>
              <FormattedMessage defaultMessage="指令" />
            </th>
            <th style={{ width: hasDirective ? '25%' : '45%', minWidth: '200px' }}>
              <FormattedMessage defaultMessage="输入值" />
            </th>
          </tr>
        </thead>
        <tbody>
          {parsed.map((arg, index) => (
            <tr key={arg.key}>
              <td>{arg.name}</td>
              <td>
                <Tooltip title={arg.type}>{arg.type}</Tooltip>
              </td>
              <td>
                {arg.isRequired ? (
                  <img src={requiredIcon} alt="required" width={15} height={15} />
                ) : (
                  <FormattedMessage defaultMessage="否" />
                )}
              </td>
              <td>
                {arg.directives?.map((directive, dIndex) => {
                  return (
                    <div key={directive.name} className="arguments-directive">
                      <span>{directive.name}</span>
                      <span
                        className="arguments-directive-remove"
                        onClick={() => props.onRemoveDirective?.(index, dIndex)}
                      >
                        <CircleCloseOutlined />
                      </span>
                    </div>
                  )
                })}
              </td>
              <td>
                {!arg.directives?.find(dir => NOT_EDITABLE_DIRECTIVES.includes(dir.name)) && (
                  <ArgumentInput
                    argument={arg}
                    enums={arg.enums}
                    value={values[arg.name]}
                    onChange={v => updateValue(v, arg.name)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ArgumentsEditor
