import { useEditorContext } from '@graphiql/react'
import { Button, Dropdown, Input, message } from 'antd'
import type {
  ArgumentNode,
  ConstArgumentNode,
  ConstDirectiveNode,
  ConstValueNode,
  DefinitionNode,
  DirectiveNode,
  FieldNode,
  GraphQLArgument,
  GraphQLDirective,
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLOutputType,
  OperationDefinitionNode,
  SelectionSetNode
} from 'graphql'
import {
  DirectiveLocation,
  Kind,
  OperationTypeNode,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isScalarType
} from 'graphql'
import { useContext, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ExitFullscreenOutlined, FullscreenOutlined } from '@/components/icons'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { registerHotkeyHandler } from '@/services/hotkey'

import { useAPIManager } from '../../../store'
import { fetcher } from '../../../utils'
import { printSchemaAST } from '../utils'
import APIRemark from './APIRemark'
import CrossOriginPopup from './CrossOriginPopup'
import DirectivePopup from './DirectivePopup'
import ExecuteButton from './ExecuteButton'
import RBACPopup from './RBACPopup'

function containLocation(
  locations: ReadonlyArray<DirectiveLocation> | undefined,
  ...location: DirectiveLocation[]
) {
  return location.some(item => locations?.includes(item))
}

const GraphiQLToolbar = () => {
  const intl = useIntl()
  const [argOpen, setArgOpen] = useState(false)
  const [transformOpen, setTransformOpen] = useState(false)
  const { query, schema, operationType, schemaAST, setQuery } = useAPIManager(state => ({
    query: state.query,
    apiDesc: state.apiDesc,
    schema: state.schema,
    schemaAST: state.schemaAST,
    setQuery: state.setQuery,
    operationType: state.computed.operationType
  }))
  const editorContext = useEditorContext({ nonNull: true })
  const workbenchCtx = useContext(WorkbenchContext)
  const [apiDirectiveOpen, setApiDirectiveOpen] = useState(false)

  const checkInject = (
    callback: (directives: DirectiveNode[], definitionNode: OperationDefinitionNode) => void
  ) => {
    if (!query) {
      message.error(intl.formatMessage({ defaultMessage: '请先创建查询语句' }))
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
        const target: DirectiveNode = {
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

  const injectAPIDirective = (directiveConfig: GraphQLDirective) => {
    checkInject(directives => {
      const index =
        directives.findIndex(
          item => item.kind === Kind.DIRECTIVE && item.name.value === directiveConfig.name
        ) ?? -1
      if (index > -1) {
        directives.splice(index, 1)
      } else {
        directives.push({
          kind: Kind.DIRECTIVE,
          name: { kind: Kind.NAME, value: directiveConfig.name },
          arguments: []
        })
      }
      setApiDirectiveOpen(false)
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

  // API参数变量插入位置是否合法
  const _isVariableDirectiveLegal = (line: any, variable: string | null) => {
    let state = line.stateAfter
    while (
      [
        Kind.DIRECTIVE,
        Kind.VARIABLE_DEFINITION,
        'VariableDefinitions',
        Kind.SELECTION_SET
      ].includes(state.kind)
    ) {
      state = state.prevState
    }
    if (['Query', 'Mutation', 'Subscription'].includes(state.kind)) {
      if (variable) {
        return true
      }
    }
  }

  // 获取默认值
  const _getDefaultArgumentValue = (arg: GraphQLInputType, defaultValue: any): ConstValueNode => {
    if (isEnumType(arg)) {
      return {
        kind: Kind.ENUM,
        value: defaultValue ?? ''
      }
    }
    if (isListType(arg)) {
      // arg.ofType
      return {
        kind: Kind.LIST,
        values: []
      }
    }
    // not tested
    if (isInputObjectType(arg)) {
      return {
        kind: Kind.OBJECT,
        fields: []
      }
    }
    if (isScalarType(arg)) {
      return {
        kind: Kind.STRING,
        value: defaultValue ?? ''
      }
    }
    return {
      kind: Kind.STRING,
      value: defaultValue ?? ''
    }
  }

  // 插入到API参数变量
  const _injectVariableDirective = (
    variable: string,
    directive: GraphQLDirective,
    definitionNode: OperationDefinitionNode
  ) => {
    const varDef = definitionNode.variableDefinitions!.find(v => v.variable.name.value === variable)
    if (varDef) {
      // @ts-ignore
      varDef.directives = varDef.directives ?? []
      if (varDef.directives.some(dir => dir.name.value === directive.name)) {
        message.warning(intl.formatMessage({ defaultMessage: '指令已存在' }))
      } else {
        ;(varDef.directives as ConstDirectiveNode[]).push({
          kind: Kind.DIRECTIVE,
          name: { kind: Kind.NAME, value: `${directive.name}` },
          arguments: directive.args
            ?.filter(arg => isNonNullType(arg.type))
            ?.map<ConstArgumentNode>(arg => ({
              kind: Kind.ARGUMENT,
              name: { kind: Kind.NAME, value: arg.name },
              // 默认值设置起来可能很复杂
              value: _getDefaultArgumentValue(
                (arg.type as GraphQLNonNull<GraphQLInputType>).ofType,
                arg.defaultValue
              )
            }))
        })
        setQuery(printSchemaAST(schemaAST!))
        setArgOpen(false)
      }
    }
  }

  // 是否是字段节点
  const _isFieldDirectiveLegal = (definitionNode: OperationDefinitionNode) => {
    const state = getEditState()
    const _node = lookupNode(state, definitionNode)
    // TODO 还要判断是否是标量
    if (_node && (_node.kind === Kind.FIELD) || (_node.kind === Kind.SELECTION_SET)) {
      return _node as FieldNode
    }
  }

  // 字段节点插入指令
  const _injectFieldDirective = (node: FieldNode, directive: GraphQLDirective) => {
    // @ts-ignore
    node.directives = node.directives ?? []
    if (
      !node.directives!.find(
        dir => dir.kind === Kind.DIRECTIVE && dir.name.value === directive.name
      )
    ) {
      ;(node.directives as DirectiveNode[]).push({
        kind: Kind.DIRECTIVE,
        name: { kind: Kind.NAME, value: directive.name },
        arguments: directive.args
          ?.filter(arg => isNonNullType(arg.type))
          ?.map<ConstArgumentNode>(arg => ({
            kind: Kind.ARGUMENT,
            name: { kind: Kind.NAME, value: arg.name },
            // 默认值设置起来可能很复杂
            value: _getDefaultArgumentValue(
              (arg.type as GraphQLNonNull<GraphQLInputType>).ofType,
              arg.defaultValue
            )
          }))
      })
    }
    setQuery(printSchemaAST(schemaAST!))
  }

  const injectArgumentDirective = (directive: GraphQLDirective) => {
    checkInject((directives, definitionNode) => {
      if (editorContext.queryEditor) {
        const editor = editorContext.queryEditor
        const cursor = editor.getCursor()
        const doc = editor.getDoc()
        // @ts-ignore
        const line = doc.children[0].lines[cursor.line]
        const variable = getCursorSurroundedVariable(line.text, cursor.ch) ?? null
        const loc = directive.locations[0]
        if (loc === DirectiveLocation.VARIABLE_DEFINITION) {
          if (_isVariableDirectiveLegal(line, variable)) {
            return _injectVariableDirective(variable!, directive, definitionNode)
          }
          return message.warning(
            intl.formatMessage({
              defaultMessage: '请选择正确的参数节点',
              description: '插入指令时'
            })
          )
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

  const injectTransformDirective = (directive: GraphQLDirective) => {
    checkInject((directives, definitionNode) => {
      const state = getEditState()
      const _node = lookupNode(state, definitionNode)
      if (_isFieldDirectiveLegal(definitionNode)) {
        return _injectFieldDirective(_node, directive)
      }
      message.warning(
        intl.formatMessage({
          defaultMessage: '请选择合适的插入节点',
          description: '插入指令时'
        })
      )
    })
  }

  const toggleFullscreen = () => {
    workbenchCtx.setFullscreen(!workbenchCtx.isFullscreen)
  }

  const onApiDirectiveOpenChange = (v: boolean) => {
    setApiDirectiveOpen(v)
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

  // const isInternal = useMemo(() => {
  //   if (schemaAST?.definitions?.[0].kind === Kind.OPERATION_DEFINITION) {
  //     const { directives = [] } = schemaAST.definitions[0]
  //     const internalDirective = directives.find(dir => dir.name.value === 'internalOperation')
  //     return !!internalDirective
  //   }
  // }, [schemaAST])

  const apiDirectives = useMemo(() => {
    const directives = schema?.getDirectives()
    const map = {
      [OperationTypeNode.QUERY]: DirectiveLocation.QUERY,
      [OperationTypeNode.MUTATION]: DirectiveLocation.MUTATION,
      [OperationTypeNode.SUBSCRIPTION]: DirectiveLocation.SUBSCRIPTION
    }
    if (operationType) {
      return directives?.filter(
        dir => dir.name !== 'rbac' && containLocation(dir.locations, map[operationType])
      )
    }
    return []
  }, [operationType, schema])

  const argumentDirectives = useMemo(() => {
    const directives = schema?.getDirectives()
    return directives?.filter(
      dir =>
        containLocation(
          dir.locations,
          // DirectiveLocation.FIELD,
          DirectiveLocation.VARIABLE_DEFINITION,
          DirectiveLocation.FRAGMENT_SPREAD,
          DirectiveLocation.INLINE_FRAGMENT,
          DirectiveLocation.FIELD_DEFINITION,
          DirectiveLocation.ENUM_VALUE
        ) && !['include', 'skip', 'deprecated'].includes(dir.name)
    )
  }, [schema])

  const transformDirectives = useMemo(() => {
    const directives = schema?.getDirectives()
    return directives?.filter(
      dir =>
        containLocation(dir.locations, DirectiveLocation.FIELD) &&
        !['include', 'skip', 'deprecated'].includes(dir.name)
    )
  }, [schema])

  // 快捷键
  useEffect(() => {
    const unbind1 = registerHotkeyHandler('alt-shift-+,⌃-shift-+', { splitKey: '-' }, e => {
      e.preventDefault()
      setArgOpen(true)
    })
    const unbind2 = registerHotkeyHandler('alt+shift+-,⌃+shift+-', e => {
      e.preventDefault()
      setTransformOpen(true)
    })
    return () => {
      unbind1()
      unbind2()
    }
  }, [])

  // query是否包含queryRaw或者executeRaw
  const isRawQuery = query?.includes('queryRaw') || query?.includes('executeRaw')
  // 自动补全
  const autoCompleteRaw = async () => {
    const val = editorContext.variableEditor?.getValue()
    let value: Record<string, any> = {}
    if (val) {
      value = JSON.parse(val)
    }
    const ret = await fetcher(
      {
        operationName: 'MyQuery',
        query,
        variables: value
      },
      () => {},
      true
    )
    if (ret && !ret.error) {
      setQuery(ret)
      message.success(intl.formatMessage({ defaultMessage: '已自动补全' }))
    } else {
      message.warning(ret.error)
    }
  }

  return (
    <div>
      <div className="graphiql-toolbar">
        <ExecuteButton className="cursor-pointer mr-4" />
        <Dropdown
          dropdownRender={() => <RBACPopup value={selectedRole} onChange={injectRole} />}
          trigger={['click']}
        >
          <button className="graphiql-toolbar-btn">
            <FormattedMessage defaultMessage="@角色" description="插入指令处" />
          </button>
        </Dropdown>
        <Dropdown
          open={apiDirectiveOpen}
          onOpenChange={onApiDirectiveOpenChange}
          dropdownRender={() => (
            <DirectivePopup directives={apiDirectives ?? []} onInject={injectAPIDirective} />
          )}
          trigger={['click']}
        >
          <button className="graphiql-toolbar-btn">
            <FormattedMessage defaultMessage="API指令" description="插入指令处" />
          </button>
        </Dropdown>
        <div className="graphiql-toolbar-divider" />
        <Dropdown
          open={argOpen}
          onOpenChange={setArgOpen}
          dropdownRender={() => (
            <DirectivePopup
              directives={argumentDirectives ?? []}
              onInject={injectArgumentDirective}
            />
          )}
          trigger={['click']}
        >
          <button className="graphiql-toolbar-btn">
            <FormattedMessage defaultMessage="入参指令" description="插入指令处" />
          </button>
        </Dropdown>
        <Dropdown
          open={transformOpen}
          onOpenChange={setTransformOpen}
          dropdownRender={() => (
            <DirectivePopup
              directives={transformDirectives ?? []}
              onInject={injectTransformDirective}
            />
          )}
          trigger={['click']}
        >
          <button className="graphiql-toolbar-btn">
            <FormattedMessage defaultMessage="响应转换" description="插入指令处" />
          </button>
        </Dropdown>
        <Dropdown dropdownRender={() => <CrossOriginPopup />} trigger={['click']}>
          <button className="graphiql-toolbar-btn">
            <FormattedMessage defaultMessage="跨源关联" description="插入指令处" />
          </button>
        </Dropdown>
        <button
          className="graphiql-toolbar-btn"
          onClick={() =>
            window.open('https://docs.fireboom.io/he-xin-gai-nian/qing-qiu-shi-xu-tu', '_blank')
          }
        >
          <FormattedMessage defaultMessage="了解更多" description="插入指令处" />
        </button>
        {isRawQuery && (
          <button className="graphiql-toolbar-btn" onClick={autoCompleteRaw}>
            <FormattedMessage defaultMessage="自动补全" />
          </button>
        )}
        {/* <Dropdown
          open={seqOpen}
          overlay={seqOpen ? <Suspense><SequenceDiagram /></Suspense> : <></>}
          trigger={['click']}
          placement="bottomRight"
          onOpenChange={onSeqOpenChange}
        >
          <span className="graphiql-toolbar-sequence-chart">
            <FormattedMessage defaultMessage="时序图" description="插入指令处" />
          </span>
        </Dropdown> */}

        <span className="ml-auto graphiql-toolbar-fullscreen" onClick={toggleFullscreen}>
          {workbenchCtx.isFullscreen ? <ExitFullscreenOutlined /> : <FullscreenOutlined />}
        </span>
      </div>
      <APIRemark />
    </div>
  )
}

export default GraphiQLToolbar
