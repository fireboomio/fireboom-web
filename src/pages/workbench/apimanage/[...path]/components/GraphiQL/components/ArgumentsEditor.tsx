import { useEditorContext } from '@graphiql/react'
import { Checkbox, message, Tooltip } from 'antd'
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
  apiPath: string
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
  const [allValues, setAllValues] = useState<Record<string, InputValueType>>({})
  const allValuesRef = useRef<Record<string, InputValueType>>({})

  const parsed = useMemo(() => {
    return parseParameters(props.arguments, schemaTypeMap)
  }, [props.arguments, schemaTypeMap])

  const hasDirective = parsed?.some(item => item.directives?.length)

  const switchKeys = () => {
    let newValues: Record<string, InputValueType>
    if (Object.keys(values).length === parsed.length) {
      newValues = {}
    } else {
      newValues = filterValues(allValuesRef.current)
    }
    setValues(newValues)
    valuesRef.current = newValues
    restoreValues(newValues, true)
  }

  const updateKey = (checked: boolean, key: string) => {
    let newValues: Record<string, InputValueType>
    if (checked) {
      const value = allValuesRef.current[key] ?? undefined
      newValues = { ...values, [key]: value }
    } else {
      newValues = { ...values }
      delete newValues[key]
    }
    setValues(newValues)
    valuesRef.current = newValues
    restoreValues(newValues, true)
  }

  const updateValue = (v: InputValueType, key: string) => {
    const newAllValues = { ...allValues, [key]: v }
    setAllValues(newAllValues)
    allValuesRef.current = newAllValues
    if (valuesRef.current.hasOwnProperty(key)) {
      const newValues = { ...values, [key]: v }
      setValues(newValues)
      valuesRef.current = newValues
    }
  }

  useEffect(() => {
    // 参数改变时要变更输入框的值
    const newValues = filterValues(valuesRef.current, true)
    setValues(newValues)
    valuesRef.current = newValues
    const newAllValues = filterValues(allValuesRef.current)
    setAllValues(newAllValues)
    allValuesRef.current = newAllValues
  }, [parsed, props.arguments])

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
              if (!(val as SingleInputValueType[]).length) {
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
                if (
                  !['ID', 'Int', 'Decimal', 'Float', 'String', 'Boolean', 'DateTime', 'Geometry'].includes(
                    item.type
                  )
                ) {
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
                } else {
                  return vItem
                }
              })
            }
          } else {
            if (item.type === 'BigInt') {
              val = `${val}`
            } else if (
              !['ID', 'Int', 'Decimal', 'Float', 'String', 'Boolean', 'DateTime', 'Geometry'].includes(
                item.type
              ) &&
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
          setAllValues({})
          allValuesRef.current = {}
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed])

  const restoreValues = (values: Record<string, InputValueType>, force = false) => {
    const storeKey = `_api_args_${props.apiPath}`
    if (Object.keys(values).length && Object.keys(values).some(k => !!values[k]) || force) {
      localStorage.setItem(storeKey, JSON.stringify(values))
    }
  }
  useDebounceEffect(
    () => { restoreValues(values) },
    [values],
    100
  )
  useDebounceEffect(
    () => {
      const storeAllKey = `_api_args_all_${props.apiPath}`
      if (Object.keys(allValues).length && Object.keys(allValues).some(k => !!allValues[k])) {
        localStorage.setItem(storeAllKey, JSON.stringify(allValues))
      }
    },
    [allValues],
    100
  )

  const filterValues = (values: any, ignoreUndefined = false) => {
    return props.arguments.reduce<Record<string, InputValueType>>((obj, arg) => {
      const name = arg.variable?.name.value
      if (name && (values.hasOwnProperty(name) || !ignoreUndefined))
      if (name) {
        obj[name] = values[name] ?? undefined
      }
      return obj
    }, {})
  }

  useEffect(() => {
    if (props.apiPath && props.arguments.length) {
      const storeKey = `_api_args_${props.apiPath}`
      const storeAllKey = `_api_args_all_${props.apiPath}`
      try {
        const savedStr = localStorage.getItem(storeKey)
        if (savedStr) {
          const savedValues = filterValues(JSON.parse(savedStr), true)
          setValues(savedValues)
          valuesRef.current = savedValues
        }
        const savedAllStr = localStorage.getItem(storeAllKey)
        const savedAllValues = savedAllStr ? filterValues(JSON.parse(savedAllStr)) : {}
        const mergedAllValues = { ...savedAllValues, ...valuesRef.current }
        setAllValues(mergedAllValues)
        allValuesRef.current = mergedAllValues
      } catch (error) {
        //
      }
    }
  }, [props.apiPath, props.arguments])
  return (
    <div className="arguments-editor max-h-50vh overflow-y-scroll">
      <table className="min-w-120 min-h-17">
        <thead>
        <tr>
          <th style={{ width: '45px' }}>
            <Checkbox
              disabled={parsed.length == 0}
              indeterminate={Object.keys(values).length > 0 && Object.keys(values).length < parsed.length}
              checked={parsed.length > 0 && Object.keys(values).length === parsed.length}
              className="text-xs w-full"
              onChange={switchKeys}
            />
          </th>
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
            <td>
              <Checkbox
                className="text-xs w-full"
                checked={values.hasOwnProperty(arg.name)}
                onChange={v => updateKey(v.target.checked, arg.name)}
              />
            </td>
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
                  value={allValues[arg.name]}
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
