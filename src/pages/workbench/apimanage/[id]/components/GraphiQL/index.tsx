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
  // ResponseEditor,
  GraphiQLProvider,
  QueryEditor,
  useEditorContext,
  useTheme
} from '@graphiql/react'
import { Tabs } from 'antd'
import type { OperationDefinitionNode, VariableDefinitionNode } from 'graphql'
import type { ReactNode } from 'react'
import React, { useEffect, useMemo, useState } from 'react'

import ArgumentsEditor from './components/ArgumentsEditor'
import { emptyStorage } from './components/emptyStorage'
import GraphiQLToolbar from './components/GraphiQLToolbar'
import ResponseWrapper, { useResponse } from './components/ResponseContext'
import ResponseViewer from './components/ResponseViewer'
import { parseSchemaAST } from './utils'

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

  const editorContext = useEditorContext({ nonNull: true })

  // const prettify = usePrettifyEditors()

  // editorContext.setResponseEditor({
  //   setValue(v) {
  //     console.log(v)
  //   }
  // })

  const schemaAST = useMemo(() => {
    try {
      return parseSchemaAST(editorContext.tabs[0].query || '')
    } catch (error) {
      //
    }
  }, [editorContext.tabs])

  const argumentList = useMemo(() => {
    const def = schemaAST?.definitions[0] as OperationDefinitionNode | undefined
    return def?.variableDefinitions || []
  }, [schemaAST])

  useEffect(() => {
    setTheme('light')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div data-testid="graphiql-container" className="graphiql-container">
      <GraphiQLToolbar />
      <QueryEditor
        editorTheme={props.editorTheme}
        keyMap={props.keyMap}
        // onClickReference={onClickReference}
        onCopyQuery={props.onCopyQuery}
        onEdit={props.onEditQuery}
        readOnly={props.readOnly}
      />
      {/* editor必须，先给隐藏起来 */}
      {/* <div className="h-100 w-100">
        <ResponseEditor
          editorTheme={props.editorTheme}
          responseTooltip={props.responseTooltip}
          keyMap={props.keyMap}
        />
      </div> */}
      <section className="graphiql-editor-tool">
        <ResponseWrapper>
          <GraphiInputAndResponse argumentList={argumentList} />
        </ResponseWrapper>
      </section>
    </div>
  )
}

interface GraphiInputAndResponseProps {
  argumentList: ReadonlyArray<VariableDefinitionNode>
}

const GraphiInputAndResponse = ({ argumentList }: GraphiInputAndResponseProps) => {
  const [activeKey, setActiveKey] = useState('arguments')

  const { response } = useResponse()

  useEffect(() => {
    if (response) {
      setActiveKey('response')
    }
  }, [response])

  return (
    <Tabs
      activeKey={activeKey}
      onChange={v => setActiveKey(v)}
      items={[
        {
          label: '输入',
          key: 'arguments',
          children: <ArgumentsEditor arguments={argumentList} onRemoveDirective={() => {}} />
        },
        { label: '响应', key: 'response', children: <ResponseViewer /> }
      ]}
    />
  )
}
