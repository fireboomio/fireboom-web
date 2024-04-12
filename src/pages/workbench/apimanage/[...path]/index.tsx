/*
 * https://github.com/graphql/graphiql/issues/118
 */

import 'graphiql/graphiql.css'

import { message } from 'antd'
import type { IntrospectionQuery } from 'graphql'
// import { debounce } from 'lodash'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { mutate } from 'swr'

import { useDragResize } from '@/hooks/resize'
import { useDataSourceList } from '@/hooks/store/dataSource'
import { useEventBus } from '@/lib/event/events'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'
import { useEngine } from '@/providers/engine'

import APIHeader from './components/APIHeader'
import { GraphiQL } from './components/GraphiQL'
// @ts-ignore
// import type { GraphiqlExplorerAction } from '@/components/GraphQLExplorer'
// import GraphiqlExplorer from '@/components/GraphQLExplorer'
import GraphiqlExplorer from './components/GraphQLExplorer/origin'
import RightSider from './components/RightSider'
// import GraphiQLExplorer from './components/GraphiQLExplorer'
import { useAPIManager } from './store'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { fetcher, fetchSubscription } from './utils'

export default function APIEditorContainer() {
  const intl = useIntl()
  const params = useParams()
  const workbenchCtx = useContext(WorkbenchContext)
  const { dragRef, elRef } = useDragResize({ direction: 'horizontal', minSize: 220 })
  const { engineStatus } = useEngine()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const dataSourceList = useDataSourceList()
  const {
    apiPath,
    engineStartCallback,
    operationName,
    query,
    schema,
    setQuery,
    refreshSchema,
    setAPIPath,
    pureUpdateAPI,
    // saved,
    // autoSave,
    setSchema,
    saveSubscriptionController
  } = useAPIManager(state => ({
    apiPath: state.apiPath,
    engineStartCallback: state.engineStartCallback,
    operationName: state.apiPath.split('/').pop(),
    query: state.query,
    editorQuery: state.editorQuery,
    schemaAST: state.schemaAST,
    schema: state.schema,
    setQuery: state.setQuery,
    refreshSchema: state.refreshSchema,
    setAPIPath: state.setAPIPath,
    pureUpdateAPI: state.pureUpdateAPI,
    // saved: state.computed.saved,
    // autoSave: state.autoSave,
    setSchema: state.setSchema,
    saveSubscriptionController: state.saveSubscriptionController
  }))
  const editingContent = useRef(query)
  const isEditingRef = useRef(false)
  const explorerRef = useRef<any>()
  const filtersMap = useMemo(
    () => ({
      query: intl.formatMessage({ defaultMessage: '查询' }),
      mutation: intl.formatMessage({ defaultMessage: '变更' }),
      subscription: intl.formatMessage({ defaultMessage: '订阅' })
    }),
    [intl]
  )

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      // 忽略关联按键
      if (!(e.altKey || e.ctrlKey || e.shiftKey)) {
        isEditingRef.current = true
      }
    }
    const onKeyup = () => {
      isEditingRef.current = false
    }
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('keyup', onKeyup)
    return () => {
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('keyup', onKeyup)
    }
  }, [])

  const onEditQuery = useCallback(
    (v: string) => {
      editingContent.current = v
      // 2023-03-07，setQuery改为立刻执行，现在setQuery已经不会再触发编辑器更新，无需担心光标跳转问题。
      //             改为立刻更新后，可以避免自动保存时存入错误的数据。
      setQuery(v, true)
    },
    [setQuery]
  )

  const dispatchFetcher = (rec: Record<string, unknown>) => {
    // @ts-ignore
    const isSubscription = rec.query.trim().startsWith('subscription')
    if (isSubscription) {
      const controller = new AbortController()
      saveSubscriptionController(controller)
      return fetchSubscription(rec, controller)
    } else {
      return fetcher(rec, setSchema)
    }
  }

  const editor = useMemo(() => {
    return (
      <GraphiQL
        fetcher={dispatchFetcher}
        onEditQuery={onEditQuery}
        defaultEditorToolsVisibility={false}
      />
    )
  }, [onEditQuery])

  const onRefreshSchema = useCallback(async () => {
    setIsRefreshing(true)
    await refreshSchema()
    setIsRefreshing(false)
    message.success(intl.formatMessage({ defaultMessage: '已刷新' }))
  }, [intl, refreshSchema])

  // 进入页面时，立刻请求一次graphql schema
  // useEffect(() => {
  //   refreshSchema()
  // }, [refreshSchema])

  useEventBus('titleChange', ({ data }) => {
    pureUpdateAPI({ path: data.path })
    void mutate(`/operation/${params.path}`)
  })
  useEventBus('apiEnableChange', ({ data }) => {
    if (data.pathList.includes(params.path!)) {
      pureUpdateAPI({ enabled: data.enabled })
    }
  })
  useEffect(() => {
    if (engineStatus === ServiceStatus.Started) {
      engineStartCallback()
    }
  }, [engineStatus])

  useEventBus('compileFinish', e => {
    engineStartCallback()
    if (!e?.value?.first) {
      refreshSchema()
    }
  })

  // useEffect(() => {
  //   // 3秒后自动保存
  //   const save = debounce(autoSave, 3000)
  //   if (!saved) {
  //     console.log('auto saved')
  //     save()
  //   }
  // }, [autoSave, saved])

  useEffect(() => {
    setAPIPath(params['*']!).then(() => {
      explorerRef.current?.manualExpand()
    })
  }, [params, setAPIPath])

  return (
    <>
      <div className="bg-white flex flex-col h-full relative" id="api-editor-container">
        <APIHeader onGetQuery={() => editingContent.current} />
        <div className="flex flex-nowrap flex-1 min-h-0 items-stretch">
          <div className="flex h-full flex-1 min-w-0 items-stretch overflow-hidden ">
            {!workbenchCtx.isFullscreen && <div className="h-full relative min-w-40" ref={elRef} style={{ width: '220px' }}>
              <div className="top-0 right-0 bottom-0 w-1 z-2 absolute" ref={dragRef}></div>
              <div className="h-full w-full relative overflow-x-auto">
                {/* <GraphiqlExplorer
                actionRef={explorerRef}
                schema={schema}
                isLoading={isRefreshing}
                dataSourceList={dataSourceList}
                query={query}
                queryAST={schemaAST}
                onChange={setQuery}
                onRefresh={onRefreshSchema}
              /> */}
                <GraphiqlExplorer
                  ref={explorerRef}
                  schema={schema}
                  filtersMap={filtersMap}
                  query={query}
                  onEdit={setQuery}
                  isLoading={isRefreshing}
                  dataSourceList={(dataSourceList ?? []).filter(d => d.enabled).map(d => d.name)}
                  explorerIsOpen
                  onRefresh={onRefreshSchema}
                  // onToggleExplorer={this._handleToggleExplorer}
                  // getDefaultScalarArgValue={getDefaultScalarArgValue}
                  // makeDefaultArg={makeDefaultArg}
                  notifyError={msg => message.error(msg)}
                />
                {/* <GraphQLExplorer
                  key={apiPath}
                  operationName={operationName}
                  schema={schema}
                  query={query}
                  loading={isRefreshing}
                  onChange={setQuery}
                  onRefresh={onRefreshSchema}
                /> */}
              </div>
            </div>}
            {editor}
          </div>
          <RightSider />
        </div>
      </div>
    </>
  )
}
