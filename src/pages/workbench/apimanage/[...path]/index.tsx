/*
 * https://github.com/graphql/graphiql/issues/118
 */

import 'graphiql/graphiql.css'

import { message } from 'antd'
import { debounce } from 'lodash'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { Observable } from 'rxjs'
import { mutate } from 'swr'

import { useDragResize } from '@/hooks/resize'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { useEventBus } from '@/lib/event/events'
import requests, { getAuthKey } from '@/lib/fetchers'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

import APIHeader from './components/APIHeader'
import { GraphiQL } from './components/GraphiQL'
// @ts-ignore
// import type { GraphiqlExplorerAction } from '@/components/GraphQLExplorer'
// import GraphiqlExplorer from '@/components/GraphQLExplorer'
import GraphiqlExplorer from './components/GraphQLExplorer/origin'
import RightSider from './components/RightSider'
// import GraphiQLExplorer from './components/GraphiqlExplorer'
import { useAPIManager } from './store'

async function fetchSubscription(rec: Record<string, unknown>, controller: AbortController) {
  return new Observable(observer => {
    fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-FB-Authentication': getAuthKey() || ''
      },
      body: JSON.stringify(rec),
      signal: controller.signal
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // 处理响应流
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      // 递归处理数据
      function readData() {
        reader.read().then(({ done, value }) => {
          console.log('read', value)
          if (done) {
            console.log('Stream is complete')
            return
          }

          // 处理数据
          const messages = decoder.decode(value)
          observer.next({ data: JSON.parse(messages) })
          // 继续读取
          readData()
        })
      }

      readData()
    })
  })
}

async function fetcher(rec: Record<string, unknown>) {
  try {
    const res = await fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-FB-Authentication': getAuthKey() || ''
      },
      body: JSON.stringify(rec)
    }).then(resp => resp.json())
    return res
  } catch (error) {
    console.error(error)
    return {
      error: (error as { message: string; stack: string })?.message || error
    }
  }
}

export default function APIEditorContainer() {
  const intl = useIntl()
  const params = useParams()
  const { dragRef, elRef } = useDragResize({ direction: 'horizontal' })
  const workbenchCtx = useContext(WorkbenchContext)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dataSourceList, setDataSourceList] = useState<string[]>([])
  const {
    engineStartCallback,
    query,
    editorQuery,
    schema,
    setQuery,
    refreshSchema,
    setAPIPath,
    pureUpdateAPI,
    setWorkbenchContext,
    saved,
    autoSave,
    saveSubscriptionController
  } = useAPIManager(state => ({
    engineStartCallback: state.engineStartCallback,
    query: state.query,
    editorQuery: state.editorQuery,
    schemaAST: state.schemaAST,
    schema: state.schema,
    setQuery: state.setQuery,
    refreshSchema: state.refreshSchema,
    setAPIPath: state.setAPIPath,
    pureUpdateAPI: state.pureUpdateAPI,
    setWorkbenchContext: state.setWorkbenchContext,
    saved: state.computed.saved,
    autoSave: state.autoSave,
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
      return fetcher(rec)
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
  useEffect(() => {
    refreshSchema()
  }, [refreshSchema])

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
    if (workbenchCtx.engineStatus === ServiceStatus.Started) {
      engineStartCallback()
    }
  }, [workbenchCtx.engineStatus])

  useEventBus('compileFinish', () => {
    engineStartCallback()
    refreshSchema()
  })

  useEffect(() => {
    // 3秒后自动保存
    const save = debounce(autoSave, 3000)
    if (!saved) {
      console.log('auto saved')
      save()
    }
  }, [autoSave, saved])

  useEffect(() => {
    setAPIPath(params['*']!).then(() => {
      explorerRef.current?.manualExpand()
    })
  }, [params, setAPIPath])

  useEffect(() => {
    setWorkbenchContext(workbenchCtx)
  }, [setWorkbenchContext, workbenchCtx])

  useEffect(() => {
    requests('/datasource').then(res => {
      // @ts-ignore
      setDataSourceList(res.filter(item => item.enabled).map(item => item.name))
    })
  }, [])

  return (
    <>
      <div className="bg-white flex flex-col h-full relative" id="api-editor-container">
        <APIHeader onGetQuery={() => editingContent.current} />
        <div className="flex flex-nowrap flex-1 min-h-0 items-stretch">
          <div className="flex h-full flex-1 min-w-0 items-stretch overflow-hidden ">
            <div className="h-full relative" ref={elRef}>
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
                  dataSourceList={dataSourceList}
                  explorerIsOpen
                  onRefresh={onRefreshSchema}
                  // onToggleExplorer={this._handleToggleExplorer}
                  // getDefaultScalarArgValue={getDefaultScalarArgValue}
                  // makeDefaultArg={makeDefaultArg}
                  notifyError={msg => message.error(msg)}
                />
              </div>
            </div>
            {editor}
          </div>
          <RightSider />
        </div>
      </div>
    </>
  )
}