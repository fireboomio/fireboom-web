/**
 * Refer: https://github.com/graphql/graphiql/blob/main/packages/graphiql/src/components/GraphiQL.tsx
 */
/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import './style.css'

import {
  type GraphiQLProviderProps,
  type UseHeaderEditorArgs,
  type UseQueryEditorArgs,
  type UseResponseEditorArgs,
  type UseVariableEditorArgs,
  type WriteableEditorProps,
  GraphiQLProvider,
  QueryEditor,
  useEditorContext,
  useTheme
} from '@graphiql/react'
import { useMonaco } from '@monaco-editor/react'
import { Tabs } from 'antd'
import type { OperationDefinitionNode, VariableDefinitionNode } from 'graphql'
import { collectVariables } from 'graphql-language-service'
import type { MutableRefObject, ReactNode } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useDragResize } from '@/hooks/resize'
import { getVariablesJSONSchema } from '@/lib/helpers/getVariablesJSONSchema'

import { useAPIManager } from '../../store'
import ArgumentsEditor from './components/ArgumentsEditor'
import { emptyStorage } from './components/emptyStorage'
import GraphiQLToolbar from './components/GraphiQLToolbar'
import ResponseWrapper, { useResponse } from './components/ResponseContext'
import ResponseViewer from './components/ResponseViewer'
import VariablesEditor from './components/VariablesEditor'
import { printSchemaAST } from './utils'

const majorVersion = parseInt(React.version.slice(0, 2), 10)

if (majorVersion < 16) {
  throw Error(
    [
      'GraphiQL 0.18.0 and after is not compatible with React 15 or below.',
      'If you are using a CDN source (jsdelivr, unpkg, etc), follow this example:',
      'https://github.com/graphql/graphiql/blob/master/examples/graphiql-cdn/index.html#L49'
    ].join('\n')
  )
}

export type GraphiQLToolbarConfig = {
  /**
   * This content will be rendered after the built-in buttons of the toolbar.
   * Note that this will not apply if you provide a completely custom toolbar
   * (by passing `GraphiQL.Toolbar` as child to the `GraphiQL` component).
   */
  additionalContent?: React.ReactNode
}

/**
 * API docs for this live here:
 *
 * https://graphiql-test.netlify.app/typedoc/modules/graphiql.html#graphiqlprops
 */
export type GraphiQLProps = Omit<GraphiQLProviderProps, 'children'> & GraphiQLInterfaceProps

/**
 * The top-level React component for GraphiQL, intended to encompass the entire
 * browser viewport.
 *
 * @see https://github.com/graphql/graphiql#usage
 */

export function GraphiQL({
  dangerouslyAssumeSchemaIsValid,
  defaultQuery,
  externalFragments,
  fetcher,
  getDefaultFieldNames,
  headers,
  inputValueDeprecation,
  introspectionQueryName,
  // maxHistoryLength,
  onEditOperationName,
  onSchemaChange,
  onTabChange,
  onTogglePluginVisibility,
  operationName,
  plugins,
  query,
  response,
  schema,
  schemaDescription,
  shouldPersistHeaders,
  // storage,
  validationRules,
  variables,
  visiblePlugin,
  ...props
}: GraphiQLProps) {
  // Ensure props are correct
  if (typeof fetcher !== 'function') {
    throw new TypeError(
      'The `GraphiQL` component requires a `fetcher` function to be passed as prop.'
    )
  }

  return (
    <GraphiQLProvider
      getDefaultFieldNames={getDefaultFieldNames}
      dangerouslyAssumeSchemaIsValid={dangerouslyAssumeSchemaIsValid}
      defaultQuery={defaultQuery}
      externalFragments={externalFragments}
      fetcher={fetcher}
      headers={headers}
      inputValueDeprecation={inputValueDeprecation}
      introspectionQueryName={introspectionQueryName}
      // maxHistoryLength={maxHistoryLength}
      onEditOperationName={onEditOperationName}
      onSchemaChange={onSchemaChange}
      onTabChange={onTabChange}
      onTogglePluginVisibility={onTogglePluginVisibility}
      plugins={plugins}
      visiblePlugin={visiblePlugin}
      operationName={operationName}
      query={query}
      response={response}
      schema={schema}
      schemaDescription={schemaDescription}
      shouldPersistHeaders={shouldPersistHeaders}
      storage={emptyStorage}
      validationRules={validationRules}
      variables={variables}
    >
      <GraphiQLInterface {...props} />
    </GraphiQLProvider>
  )
}

type AddSuffix<Obj extends Record<string, any>, Suffix extends string> = {
  [Key in keyof Obj as `${string & Key}${Suffix}`]: Obj[Key]
}

export type GraphiQLInterfaceProps = WriteableEditorProps &
  AddSuffix<Pick<UseQueryEditorArgs, 'onEdit'>, 'Query'> &
  Pick<UseQueryEditorArgs, 'onCopyQuery'> &
  AddSuffix<Pick<UseVariableEditorArgs, 'onEdit'>, 'Variables'> &
  AddSuffix<Pick<UseHeaderEditorArgs, 'onEdit'>, 'Headers'> &
  Pick<UseResponseEditorArgs, 'responseTooltip'> & {
    children?: ReactNode
    /**
     * Set the default state for the editor tools.
     * - `false` hides the editor tools
     * - `true` shows the editor tools
     * - `'variables'` specifically shows the variables editor
     * - `'headers'` specifically shows the headers editor
     * By default the editor tools are initially shown when at least one of the
     * editors has contents.
     */
    defaultEditorToolsVisibility?: boolean | 'variables' | 'headers'
    /**
     * Toggle if the headers editor should be shown inside the editor tools.
     * @default true
     */
    isHeadersEditorEnabled?: boolean
    /**
     * An object that allows configuration of the toolbar next to the query
     * editor.
     */
    toolbar?: GraphiQLToolbarConfig
  }

export function GraphiQLInterface(props: GraphiQLInterfaceProps) {
  const { setTheme } = useTheme()
  const { schemaAST, apiID, schema } = useAPIManager(state => ({
    schemaAST: state.schemaAST,
    apiID: state.apiID,
    schema: state.schema
  }))
  const editorCtx = useEditorContext()
  const { dragRef, elRef, parentRef, isHidden, resetSize } = useDragResize({
    direction: 'vertical',
    maxSize: 600
  })
  const prevApiID = useRef<string>()
  const responseRef = useRef<{
    setActiveKey?: (v: string) => void
  }>()

  // const prettify = usePrettifyEditors()

  const argumentList = useMemo(() => {
    const def = schemaAST?.definitions[0] as OperationDefinitionNode | undefined
    return def?.variableDefinitions || []
  }, [schemaAST])

  // 用于变量编辑器的json校验
  // const jsonSchema = useMemo(() => {
  //   if (!schema || !schemaAST) return
  //   const variablesToType = collectVariables(schema!, schemaAST!)
  //   return getVariablesJSONSchema(variablesToType)
  // }, [schemaAST])

  const monaco = useMonaco()
  useEffect(() => {
    if (!schema || !schemaAST) {
      return
    }
    const variablesToType = collectVariables(schema!, schemaAST!)
    const jsonSchema = getVariablesJSONSchema(variablesToType)
    delete jsonSchema?.$schema
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [{ uri: 'operation.json', fileMatch: ['operation.json'], schema: jsonSchema }]
    })
  }, [schemaAST])

  const editorContext = useEditorContext()

  // API 变更后需要刷新输入输出
  useEffect(() => {
    if (prevApiID.current && prevApiID.current !== apiID) {
      editorCtx?.responseEditor?.setValue('')
      editorCtx?.variableEditor?.setValue('')
      editorCtx?.headerEditor?.setValue('')
      responseRef.current?.setActiveKey?.('arguments')
    }
    prevApiID.current = apiID
  }, [apiID, editorCtx])

  const editor = useMemo(() => {
    return (
      <QueryEditor
        editorTheme={props.editorTheme}
        keyMap={props.keyMap}
        // onClickReference={onClickReference}
        onCopyQuery={props.onCopyQuery}
        onEdit={props.onEditQuery}
        readOnly={props.readOnly}
      />
    )
  }, [props.editorTheme, props.keyMap, props.onCopyQuery, props.onEditQuery, props.readOnly])

  useEffect(() => {
    setTheme('light')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div data-testid="graphiql-container" className="graphiql-container" ref={parentRef}>
      <GraphiQLToolbar />
      {editor}
      <section className="graphiql-editor-tool" ref={elRef}>
        <div className="graphiql-editor-tool-resize-handler" ref={dragRef}></div>
        <ResponseWrapper>
          <GraphiInputAndResponse
            apiID={apiID}
            actionRef={responseRef}
            argumentList={argumentList}
            onTabChange={() => {
              if (isHidden) {
                resetSize(180)
              }
            }}
          />
        </ResponseWrapper>
      </section>
    </div>
  )
}

interface GraphiInputAndResponseProps {
  apiID: string
  argumentList: ReadonlyArray<VariableDefinitionNode>
  actionRef?: MutableRefObject<
    | {
        setActiveKey?: (v: string) => void
      }
    | undefined
  >
  onTabChange: (activeKey: string) => void
}

const GraphiInputAndResponse = ({
  apiID,
  argumentList,
  actionRef,
  onTabChange
}: GraphiInputAndResponseProps) => {
  const [activeKey, setActiveKey] = useState('arguments')
  const [variableMode, setVariableMode] = useState<'json' | 'form'>('form')

  const { response } = useResponse()

  const { setQuery, schemaAST } = useAPIManager()

  const onRemoveDirective = (argumentIndex: number, directiveIndex: number) => {
    // @ts-ignore
    schemaAST.definitions[0].variableDefinitions[argumentIndex].directives.splice(directiveIndex, 1)
    setQuery(printSchemaAST(schemaAST!))
  }

  useEffect(() => {
    if (response) {
      setActiveKey('response')
    }
  }, [response])

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        setActiveKey
      }
    }
  }, [actionRef])
  return (
    <div className="h-full">
      {activeKey === 'arguments' && (
        <div className="absolute top-0px h-26px right-0px z-20 flex">
          <div
            className="h-full w-30px flex items-center justify-center cursor-pointer"
            style={{ borderLeft: '1px solid rgba(95,98,105,0.1)' }}
            onClick={() => {
              setVariableMode('form')
            }}
          >
            <img
              src={
                variableMode === 'form' ? '/assets/view-list-active.svg' : '/assets/view-list.svg'
              }
              alt=""
            />
          </div>
          <div
            className="h-full w-30px flex items-center justify-center cursor-pointer"
            style={{ borderLeft: '1px solid rgba(95,98,105,0.1)' }}
            onClick={() => {
              setVariableMode('json')
            }}
          >
            <img
              src={
                variableMode === 'json'
                  ? '/assets/view-editor-active.svg'
                  : '/assets/view-editor.svg'
              }
              alt=""
            />
          </div>
        </div>
      )}
      {/*{activeKey === 'arguments' && (*/}
      {/*  <Radio.Group*/}
      {/*    size="small"*/}
      {/*    className="absolute top-2px right-10px z-10 "*/}
      {/*    value={variableMode}*/}
      {/*    onChange={e => {*/}
      {/*      setVariableMode(e.target.value)*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Popover content="表单模式" trigger="hover">*/}
      {/*      <Radio.Button value="form">*/}
      {/*        <img src={iconDesignModeActive} alt="" />*/}
      {/*      </Radio.Button>*/}
      {/*    </Popover>*/}
      {/*    <Popover content="编辑器模式" trigger="hover">*/}
      {/*      <Radio.Button value="json">*/}
      {/*        <img src={iconEditMode} alt="" />*/}
      {/*      </Radio.Button>*/}
      {/*    </Popover>*/}
      {/*  </Radio.Group>*/}
      {/*)}*/}
      <Tabs
        className="graphiql-editor-tool-tabs"
        activeKey={activeKey}
        onChange={v => setActiveKey(v)}
        onTabClick={onTabChange}
        items={[
          {
            label: '输入',
            key: 'arguments',
            children: (
              <>
                {variableMode === 'form' ? (
                  <ArgumentsEditor
                    apiID={apiID}
                    arguments={argumentList}
                    onRemoveDirective={onRemoveDirective}
                  />
                ) : (
                  <VariablesEditor apiID={apiID} onRemoveDirective={onRemoveDirective} />
                )}
              </>
            )
          },
          { label: '响应', key: 'response', children: <ResponseViewer /> }
        ]}
      />
    </div>
  )
}
