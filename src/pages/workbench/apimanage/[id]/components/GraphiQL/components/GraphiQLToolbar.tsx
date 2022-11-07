import { useEditorContext } from '@graphiql/react'
import { Dropdown, message } from 'antd'
import type {
  ConstDirectiveNode,
  DefinitionNode,
  DirectiveNode,
  FieldNode,
  OperationDefinitionNode,
  SelectionSetNode
} from 'graphql'
import { Kind } from 'graphql'
import { useContext, useEffect, useMemo, useState } from 'react'

import { WorkbenchContext } from '@/lib/context/workbenchContext'

import { useAPIManager } from '../../../store'
import { ExitFullscreenOutlined, FullscreenOutlined } from '../../icons'
import { printSchemaAST } from '../utils'
import ArgumentDirectivePopup from './ArgumentDirectivePopup'
import CrossOriginPopup from './CrossOriginPopup'
import ExecuteButton from './ExecuteButton'
import InternalPopup from './InternalPopup'
import RBACPopup from './RBACPopup'

const GraphiQLToolbar = () => {
  const [argOpen, setArgOpen] = useState(false)
  const { query, schemaAST, setQuery } = useAPIManager(state => ({
    query: state.query,
    schemaAST: state.schemaAST,
    setQuery: state.setQuery
  }))
  const editorContext = useEditorContext({ nonNull: true })
  const workbenchCtx = useContext(WorkbenchContext)

  const checkInject = (
    callback: (directives: DirectiveNode[], definitionNode: OperationDefinitionNode) => void
  ) => {
    if (!query) {
      message.error('请先创建查询语句')
    }
    if (schemaAST) {
      if (schemaAST.definitions[0]?.kind === Kind.OPERATION_DEFINITION) {
        callback(schemaAST.definitions[0]!.directives as DirectiveNode[], schemaAST.definitions[0]!)
      }
    }
  }

  const injectRole = ({ rule, value }: { rule: string; value: string[] }) => {
    checkInject(directives => {
      // toggle
      const index =
        directives.findIndex(item => item.kind === Kind.DIRECTIVE && item.name.value === 'rbac') ??
        -1
      if (!rule || !value.length) {
        if (index > -1) {
          directives.splice(index, 1)
        }
      } else {
        let target: DirectiveNode = {
          kind: Kind.DIRECTIVE,
          name: { kind: Kind.NAME, value: 'rbac' },
          arguments: [
            {
              kind: Kind.ARGUMENT,
              name: { kind: Kind.NAME, value: rule },
              value: {
                kind: Kind.LIST,
                values: value.map(item => ({
                  kind: Kind.ENUM,
                  value: item
                }))
              }
            }
          ]
        }
        if (index < 0) {
          directives.push(target)
        }
        if (index > -1) {
          directives[index] = target
        }
      }
      setQuery(printSchemaAST(schemaAST!))
    })
  }

  const injectInternalOperation = (isInternal: boolean) => {
    checkInject(directives => {
      const index =
        directives.findIndex(
          item => item.kind === Kind.DIRECTIVE && item.name.value === 'internalOperation'
        ) ?? -1
      if (index > -1) {
        if (!isInternal) {
          directives.splice(index, 1)
        }
      } else {
        if (isInternal) {
          directives.push({
            kind: Kind.DIRECTIVE,
            name: { kind: Kind.NAME, value: 'internalOperation' },
            arguments: []
          })
        }
      }
      setQuery(printSchemaAST(schemaAST!))
    })
  }

  const getEditState = () => {
    if (editorContext.queryEditor) {
      const editor = editorContext.queryEditor
      const cursor = editor.getCursor()
      const doc = editor.getDoc()
      const line = doc.children[0].lines[cursor.line]
      const state = line.stateAfter
      console.log(state)
      return state
    }
  }

  // 获取鼠标周边的变量
  const getCursorSurroundedVariable = (text: string, index: number) => {
    if (text) {
      let startIndex = Math.max(index - 1, 0)
      let endIndex = index
      while (startIndex > 0 && ![',', '('].includes(text[startIndex])) {
        startIndex--
      }
      if (startIndex > 0) startIndex++
      startIndex = Math.max(startIndex, 0)
      while (endIndex < text.length - 1 && ![',', ')'].includes(text[endIndex])) {
        endIndex++
      }
      endIndex = Math.min(endIndex, text.length - 1)
      return text.substring(startIndex, endIndex).match(/\$([\da-zA-Z_]+)/)?.[1]
    }
    return null
  }

  const injectArgument = (name: string, val: ConstDirectiveNode) => {
    checkInject((directives, definitionNode) => {
      if (editorContext.queryEditor) {
        const editor = editorContext.queryEditor
        const cursor = editor.getCursor()
        const doc = editor.getDoc()
        const line = doc.children[0].lines[cursor.line]
        let state = line.stateAfter
        while (
          ['Directive', 'VariableDefinition', 'VariableDefinitions', 'SelectionSet'].includes(
            state.kind
          )
        ) {
          state = state.prevState
        }
        if (['Query', 'Mutation', 'Subscription'].includes(state.kind)) {
          const variable = getCursorSurroundedVariable(line.text, cursor.ch as number)
          if (!variable) {
            return message.warn('请选择正确的参数节点')
          }
          const varDef = definitionNode.variableDefinitions!.find(
            v => v.variable.name.value === variable
          )
          if (varDef) {
            // @ts-ignore
            varDef.directives = varDef.directives ?? []
            if (varDef.directives?.some(dir => dir.name.value === name)) {
              message.warn('指令已存在')
            } else {
              // @ts-ignore
              varDef.directives!.push(val)
              setQuery(printSchemaAST(schemaAST!))
              setArgOpen(false)
            }
          }
        } else {
          message.warn('请选择正确的参数节点')
        }
      }
    })
  }

  const lookupNode = (state: any, definitionNode: DefinitionNode) => {
    const states = [state]
    let _state = state
    // 向上查找
    while (_state.prevState) {
      if (!['Query', 'Mutation', 'Subscription'].includes(_state.kind)) {
        _state = _state.prevState
        states.unshift(_state)
      } else {
        break
      }
    }
    // 最后一个如果是 SelectionSet 则认为是在对象那一行
    if (states[states.length - 1].kind === 'SelectionSet') {
      states.pop()
    }
    // 从上往下查找
    let node: any = definitionNode
    for (const s of states) {
      if (s.kind === 'SelectionSet') {
        node = (node as OperationDefinitionNode)['selectionSet']
      } else if (s.kind === 'Selection') {
        node = (node as SelectionSetNode)['selections']
      } else if (s.kind === 'Field') {
        node = (node as FieldNode[]).find(item => item.name.value === s.name)
      } else if (s.kind === 'AliasedField') {
        node = (node as FieldNode[]).find(item => item.alias && item.name.value === s.name)
      }
    }
    return node
  }

  const injectTransform = () => {
    checkInject((directives, definitionNode) => {
      const state = getEditState()
      if (state) {
        if (state.kind === 'SelectionSet' || state.kind === 'Field') {
          const _node = lookupNode(state, definitionNode)
          // TODO 还要判断是否是标量
          if (_node && _node.kind === 'Field') {
            const node = _node as FieldNode
            // @ts-ignore
            node.directives = node.directives ?? []
            if (
              !node.directives!.find(
                dir => dir.kind === Kind.DIRECTIVE && dir.name.value === 'transform'
              )
            ) {
              ;(node.directives as DirectiveNode[]).push({
                kind: Kind.DIRECTIVE,
                name: { kind: Kind.NAME, value: 'transform' },
                arguments: [
                  {
                    kind: Kind.ARGUMENT,
                    name: { kind: Kind.NAME, value: 'get' },
                    value: { kind: Kind.STRING, value: 'REPLACE_ME', block: false }
                  }
                ]
              })
            }
            return setQuery(printSchemaAST(schemaAST!))
          }
        }
      }
      message.warn('请选择合适的插入节点')
    })
  }

  const toggleFullscreen = () => {
    workbenchCtx.setFullscreen(!workbenchCtx.isFullscreen)
  }

  const onArgOpenChange = (e: boolean) => {
    setArgOpen(e)
  }

  const selectedRole = useMemo(() => {
    if (schemaAST?.definitions?.[0].kind === Kind.OPERATION_DEFINITION) {
      const { directives = [] } = schemaAST.definitions[0]
      const rbacDirective = directives.find(dir => dir.name.value === 'rbac')
      if (rbacDirective) {
        const arg = rbacDirective.arguments?.[0]
        return {
          rule: arg?.name.value,
          value:
            arg?.value.kind === Kind.LIST
              ? arg.value.values.map(item => (item.kind === Kind.ENUM ? item.value : ''))
              : []
        }
      }
    }
  }, [schemaAST])

  const isInternal = useMemo(() => {
    if (schemaAST?.definitions?.[0].kind === Kind.OPERATION_DEFINITION) {
      const { directives = [] } = schemaAST.definitions[0]
      const internalDirective = directives.find(dir => dir.name.value === 'internalOperation')
      return !!internalDirective
    }
  }, [schemaAST])

  return (
    <div className="graphiql-toolbar">
      <ExecuteButton className="cursor-pointer mr-4" />
      <Dropdown
        overlay={<RBACPopup value={selectedRole} onChange={injectRole} />}
        trigger={['click']}
      >
        <button className="graphiql-toolbar-btn">@角色</button>
      </Dropdown>
      <Dropdown
        overlay={<InternalPopup value={isInternal} onChange={injectInternalOperation} />}
        trigger={['click']}
      >
        <button className="graphiql-toolbar-btn">@内部</button>
      </Dropdown>
      <div className="graphiql-toolbar-divider" />
      <Dropdown
        open={argOpen}
        onOpenChange={onArgOpenChange}
        overlay={<ArgumentDirectivePopup onInject={injectArgument} />}
        trigger={['click']}
      >
        <button className="graphiql-toolbar-btn">入参指令</button>
      </Dropdown>
      <button className="graphiql-toolbar-btn" onClick={injectTransform}>
        响应转换
      </button>
      <Dropdown overlay={<CrossOriginPopup />} trigger={['click']}>
        <button className="graphiql-toolbar-btn">跨源关联</button>
      </Dropdown>
      <span className="graphiql-toolbar-sequence-chart">时序图</span>
      <span className="graphiql-toolbar-fullscreen" onClick={toggleFullscreen}>
        {workbenchCtx.isFullscreen ? <ExitFullscreenOutlined /> : <FullscreenOutlined />}
      </span>
    </div>
  )
}

export default GraphiQLToolbar
