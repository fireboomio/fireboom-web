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
import type { OperationDefinitionNode, VariableDefinitionNode, SelectionNode } from 'graphql'
import { collectVariables } from 'graphql-language-service'
import type { MutableRefObject, ReactNode } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import { useDragResize } from '@/hooks/resize'
import { getVariablesJSONSchema } from '@/lib/helpers/getVariablesJSONSchema'
import { registerHotkeyHandler } from '@/services/hotkey'

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
export type GraphiQLProps = Omit<GraphiQLProviderProps, 'children' | 'schema' | 'query'> &
  GraphiQLInterfaceProps

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
  // query,
  response,
  // schema,
  schemaDescription,
  shouldPersistHeaders,
  // storage,
  validationRules,
  variables,
  visiblePlugin,
  ...props
}: GraphiQLProps) {
  const { schema, query } = useAPIManager(state => ({
    schema: state.schema,
    query: state.query
  }))
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
  const { schemaAST, apiPath, schema, clearHistoryFlag } = useAPIManager(state => ({
    schemaAST: state.schemaAST,
    apiPath: state.apiPath,
    schema: state.schema,
    clearHistoryFlag: state.clearHistoryFlag
  }))
  const editorCtx = useEditorContext()
  const { dragRef, elRef, parentRef, isHidden, resetSize } = useDragResize({
    direction: 'vertical',
    maxSize: 600
  })
  const prevApiPath = useRef<string>()
  const responseRef = useRef<{
    setActiveKey?: (v: string) => void
  }>()

  // const prettify = usePrettifyEditors()

  const argumentList = useMemo(() => {
    const def = schemaAST?.definitions[0] as OperationDefinitionNode | undefined
    return def?.variableDefinitions || []
  }, [schemaAST])

  const exportAsValues = useMemo(() => {
    const exportAsValues: string[] = []
    const def = schemaAST?.definitions[0] as OperationDefinitionNode | undefined
    if (def?.selectionSet) {
      const fields = def.selectionSet.selections;
      const traverseFields = (fields: readonly SelectionNode[]) => {
        fields.forEach((field) => {
          if (field.kind === 'Field') {
            if (field.directives) {
              field.directives.forEach((directive) => {
                if (directive.name.value === 'export' && directive.arguments) {
                  directive.arguments.forEach((arg) => {
                    if (arg.name.value === 'as' && arg.value.kind === 'StringValue' && !exportAsValues.includes(arg.value.value)) {
                      exportAsValues.push(arg.value.value);
                    }
                  });
                }
              });
            }

            if (field.selectionSet && field.selectionSet.selections) {
              traverseFields(field.selectionSet.selections);
            }
          }
        });
      };

      traverseFields(fields);
    }
    return exportAsValues
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
    exportAsValues.forEach(v => delete variablesToType[v])
    const jsonSchema = getVariablesJSONSchema(variablesToType)
    delete jsonSchema?.$schema

    // 完整schema
    const schemaList = [
      {
        uri: 'operation.json',
        fileMatch: ['operation.json'],
        schema: jsonSchema
      }
    ]
    Object.keys(jsonSchema.properties!).forEach(key => {
      const subSchema = jsonSchema.properties![key] as any
      if (subSchema.type === 'array') {
        schemaList.push({
          uri: `operation_${key}.json`,
          fileMatch: [`operation_${key}.json`],
          schema: {
            $ref: subSchema.items.$ref,
            description: subSchema.description,
            definitions: jsonSchema.definitions
          }
        })
      } else {
        schemaList.push({
          uri: `operation_${key}.json`,
          fileMatch: [`operation_${key}.json`],
          schema: { ...subSchema, definitions: jsonSchema.definitions }
        })
      }
    })
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: schemaList
      // schemas: [{ uri: 'operation.json', fileMatch: ['operation.json'], schema: jsonSchema }]
    })
  }, [schema, schemaAST])

  useEffect(() => {
    // 当api变更时，该flag会同步变更，触发历史记录清理。
    // 由于query变更此时尚未生效所以需要延迟执行。以保证清理时editor内容已经变更为新的query
    setTimeout(() => {
      editorCtx?.queryEditor?.clearHistory()
    })
  }, [clearHistoryFlag])
  // API 变更后需要刷新输入输出
  useEffect(() => {
    if (prevApiPath.current && prevApiPath.current !== apiPath) {
      editorCtx?.responseEditor?.setValue('')
      editorCtx?.variableEditor?.setValue('')
      editorCtx?.headerEditor?.setValue('')
      responseRef.current?.setActiveKey?.('arguments')
    }
    prevApiPath.current = apiPath
  }, [apiPath, editorCtx])

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
            apiPath={apiPath}
            actionRef={responseRef}
            argumentList={argumentList}
            exportAsValues={exportAsValues}
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
  apiPath: string
  argumentList: ReadonlyArray<VariableDefinitionNode>
  exportAsValues: ReadonlyArray<string>
  actionRef?: MutableRefObject<
    | {
        setActiveKey?: (v: string) => void
      }
    | undefined
  >
  onTabChange: (activeKey: string) => void
}

const GraphiInputAndResponse = ({
  apiPath,
  argumentList,
  exportAsValues,
  actionRef,
  onTabChange
}: GraphiInputAndResponseProps) => {
  const intl = useIntl()
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

  // 快捷键
  useEffect(() => {
    return registerHotkeyHandler('alt+shift+t,^+shift+t', () => {
      setVariableMode(variableMode === 'form' ? 'json' : 'form')
    })
  }, [variableMode])

  return (
    <div className="bg-white h-full">
      {activeKey === 'arguments' && (
        <div className="flex h-26px top-0px right-0px z-20 absolute">
          <div
            className="cursor-pointer flex h-full w-30px items-center justify-center"
            style={{ borderLeft: '1px solid rgba(95,98,105,0.1)' }}
            onClick={() => {
              setVariableMode('form')
            }}
          >
            <img
              src={
                variableMode === 'form'
                  ? `${import.meta.env.BASE_URL}assets/view-list-active.svg`
                  : `${import.meta.env.BASE_URL}assets/view-list.svg`
              }
              alt=""
            />
          </div>
          <div
            className="cursor-pointer flex h-full w-30px items-center justify-center"
            style={{ borderLeft: '1px solid rgba(95,98,105,0.1)' }}
            onClick={() => {
              setVariableMode('json')
            }}
          >
            <img
              src={
                variableMode === 'json'
                  ? `${import.meta.env.BASE_URL}assets/view-editor-active.svg`
                  : `${import.meta.env.BASE_URL}assets/view-editor.svg`
              }
              alt=""
            />
          </div>
        </div>
      )}
      <Tabs
        className="graphiql-editor-tool-tabs !h-full"
        activeKey={activeKey}
        onChange={v => setActiveKey(v)}
        onTabClick={onTabChange}
        items={[
          {
            label: intl.formatMessage({ defaultMessage: '输入' }),
            key: 'arguments',
            className: '!h-full',
            children: (
              <>
                {variableMode === 'form' ? (
                  <ArgumentsEditor
                    apiPath={apiPath}
                    arguments={argumentList}
                    exportAsValues={exportAsValues}
                    onRemoveDirective={onRemoveDirective}
                  />
                ) : (
                  <VariablesEditor apiPath={apiPath} onRemoveDirective={onRemoveDirective} />
                )}
              </>
            )
          },
          {
            label: intl.formatMessage({ defaultMessage: '响应' }),
            key: 'response',
            children: <ResponseViewer />
          }
        ]}
      />
    </div>
  )
}
