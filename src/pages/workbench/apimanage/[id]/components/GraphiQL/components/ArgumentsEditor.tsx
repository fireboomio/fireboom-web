import { useEditorContext } from '@graphiql/react'
import { message, Tooltip } from 'antd'
import type { VariableDefinitionNode } from 'graphql'
import { useEffect, useMemo, useRef, useState } from 'react'

import { parseParameters } from '@/lib/gql-parser'

import { CircleCloseOutlined } from '../../icons'
import requiredIcon from '../assets/required.svg'
import type { InputValueType } from './ArgumentInput'
import ArgumentInput from './ArgumentInput'

interface ArgumentsEditorProps {
  arguments: ReadonlyArray<VariableDefinitionNode>
  onRemoveDirective: (argumentIndex: number, directiveIndex: number) => void
}

const ArgumentsEditor = (props: ArgumentsEditorProps) => {
  const editorContext = useEditorContext()
  const [values, setValues] = useState<InputValueType[]>([])
  const valuesRef = useRef<InputValueType[]>([])

  const parsed = useMemo(() => {
    return parseParameters(props.arguments)
  }, [props.arguments])

  const updateValue = (v: InputValueType, index: number) => {
    const clone = values.slice()
    clone.splice(index, 1, v)
    setValues(clone)
    valuesRef.current = clone
  }

  useEffect(() => {
    // 参数改变时要变更输入框的值
    const originValueMap = valuesRef.current.reduce<Record<string, InputValueType>>(
      (map, val, index) => {
        if (val !== null && val !== undefined) {
          const param = parsed[index]
          if (param) {
            map[param.name] = val
          }
        }
        return map
      },
      {}
    )
    setValues(
      props.arguments.map(item => {
        const name = item.variable?.name.value
        if (name && name in originValueMap) {
          return originValueMap[name]
        }
        return ''
      })
    )
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
        const obj = parsed.reduce<Record<string, any>>((obj, item, index) => {
          let val = valuesRef.current[index]
          if (item.isRequired && (val === '' || val === undefined || val === null)) {
            message.error(`字段 ${item.name} 的参数未提供`)
            throw new Error(`字段 ${item.name} 的参数未提供`)
          }
          if (!['Int', 'String', 'Boolean'].includes(item.type)) {
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
          const val = props.arguments.map(() => '')
          setValues(val)
          valuesRef.current = val
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed])

  return (
    <div className="arguments-editor">
      <table>
        <thead>
          <tr>
            <th style={{ width: '80px' }}>参数</th>
            <th style={{ width: '112px' }}>类型</th>
            <th style={{ width: '56px' }}>必填</th>
            <th>指令</th>
            <th style={{ width: '200px' }}>输入值</th>
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
                  '否'
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
                <ArgumentInput
                  argument={arg}
                  value={values[0]}
                  onChange={v => updateValue(v, index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ArgumentsEditor
