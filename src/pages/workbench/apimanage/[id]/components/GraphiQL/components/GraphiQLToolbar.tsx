import { useEditorContext } from '@graphiql/react'
import { Dropdown, message } from 'antd'
import type {
  DefinitionNode,
  DirectiveNode,
  DocumentNode,
  FieldNode,
  OperationDefinitionNode,
  SelectionNode,
  SelectionSetNode
} from 'graphql'
import { Kind } from 'graphql'

import { useAPIManager } from '../../../hooks'
import fullscreenIcon from '../assets/fullscreen.svg'
import { printSchemaAST } from '../utils'
import ArgumentDirectivePopup from './ArgumentDirectivePopup'
import CrossOriginPopup from './CrossOriginPopup'
import ExecuteButton from './ExecuteButton'
import RBACPopup from './RBACPopup'

const GraphiQLToolbar = () => {
  const { query, schemaAST, setQuery } = useAPIManager()
  const editorContext = useEditorContext({ nonNull: true })

  const checkInject = (
    callback: (directives: DirectiveNode[], definitionNode: DefinitionNode) => void
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

  const injectInternalOperation = () => {
    checkInject(directives => {
      // toggle
      const index =
        directives.findIndex(
          item => item.kind === Kind.DIRECTIVE && item.name.value === 'internalOperation'
        ) ?? -1
      if (index > -1) {
        directives.splice(index, 1)
      } else {
        directives.push({
          kind: Kind.DIRECTIVE,
          name: { kind: Kind.NAME, value: 'internalOperation' },
          arguments: []
        })
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

  const injectArgument = () => {
    if (editorContext.queryEditor) {
      const editor = editorContext.queryEditor
      const cursor = editor.getCursor()
      const doc = editor.getDoc()
      const line = doc.children[0].lines[cursor.line]
      const state = line.stateAfter.prevState
      console.log(state)
      window.editor = editor
      // TODO
    }
  }

  const lookup = (state: any, definitionNode: DefinitionNode) => {
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
          const _node = lookup(state, definitionNode)
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

  return (
    <div className="graphiql-toolbar">
      <ExecuteButton className="cursor-pointer mr-6" />
      <Dropdown overlay={<RBACPopup onChange={injectRole} />} trigger={['click']}>
        <button className="graphiql-toolbar-btn">@角色</button>
      </Dropdown>
      <button className="graphiql-toolbar-btn" onClick={injectInternalOperation}>
        @内部
      </button>
      <div className="graphiql-toolbar-divider" />
      <Dropdown overlay={<ArgumentDirectivePopup />} trigger={['click']}>
        <button className="graphiql-toolbar-btn">入参指令</button>
      </Dropdown>
      <button className="graphiql-toolbar-btn" onClick={injectTransform}>
        响应转换
      </button>
      <Dropdown overlay={<CrossOriginPopup />} trigger={['click']}>
        <button className="graphiql-toolbar-btn">跨源关联</button>
      </Dropdown>
      <span className="graphiql-toolbar-sequence-chart">时序图</span>
      <img
        className="graphiql-toolbar-fullscreen"
        src={fullscreenIcon}
        width="10"
        height="10"
        alt="toggle fullscreen"
      />
    </div>
  )
}

export default GraphiQLToolbar
