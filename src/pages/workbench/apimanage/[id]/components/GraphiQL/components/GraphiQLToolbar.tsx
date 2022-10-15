import { useEditorContext } from '@graphiql/react'
import { Dropdown, message } from 'antd'
import type { DirectiveNode } from 'graphql'
import { Kind } from 'graphql'
import { useMemo } from 'react'

import { useAPIManager } from '../../../hooks'
import fullscreenIcon from '../assets/fullscreen.svg'
import { parseSchemaAST, printSchemaAST } from '../utils'
import ExecuteButton from './ExecuteButton'
import RBACPopup from './RBACPopup'

const GraphiQLToolbar = () => {
  const { query, setQuery } = useAPIManager()
  const editorContext = useEditorContext({ nonNull: true })

  const schemaAST = useMemo(() => {
    try {
      return parseSchemaAST(query)
    } catch (error) {
      //
    }
  }, [query])

  const checkInject = () => {
    if (!query) {
      message.error('请先创建查询语句')
      return false
    }
    return true
  }

  const injectInternalOperation = () => {
    if (checkInject()) {
      if (schemaAST) {
        if (schemaAST.definitions[0]?.kind === Kind.OPERATION_DEFINITION) {
          // toggle
          const index =
            schemaAST.definitions[0].directives?.findIndex(
              item => item.kind === Kind.DIRECTIVE && item.name.value === 'internalOperation'
            ) ?? -1
          if (index > -1) {
            ;(schemaAST.definitions[0].directives as DirectiveNode[]).splice(index, 1)
          } else {
            ;(schemaAST.definitions[0].directives as DirectiveNode[]).push({
              kind: Kind.DIRECTIVE,
              name: { kind: Kind.NAME, value: 'internalOperation' },
              arguments: []
            })
          }
          setQuery(printSchemaAST(schemaAST))
        }
      }
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
      // TODO
    }
  }

  return (
    <div className="graphiql-toolbar">
      <ExecuteButton className="cursor-pointer mr-6" />
      <Dropdown overlay={<RBACPopup />} trigger={['click']}>
        <button className="graphiql-toolbar-btn">@角色</button>
      </Dropdown>
      <button className="graphiql-toolbar-btn" onClick={injectInternalOperation}>
        @内部
      </button>
      <div className="graphiql-toolbar-divider" />
      <button className="graphiql-toolbar-btn" onClick={injectArgument}>
        入参指令
      </button>
      <button className="graphiql-toolbar-btn">响应转换</button>
      <button className="graphiql-toolbar-btn">跨源关联</button>
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
