/*
 * https://github.com/graphql/graphiql/issues/118
 */

import 'graphiql/graphiql.css'

import { message, Tabs } from 'antd'
import { debounce } from 'lodash'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import ApiConfig from '@/components/apiConfig'
// @ts-ignore
import type { GraphiqlExplorerAction } from '@/components/GraphQLExplorer'
import GraphiqlExplorer1 from '@/components/GraphQLExplorer'
import { useDragResize } from '@/hooks/resize'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { useEventBus } from '@/lib/event/events'
import requests from '@/lib/fetchers'

import APIFlowChart from './components/APIFlowChart'
import APIHeader from './components/APIHeader'
import { GraphiQL } from './components/GraphiQL'
// import GraphiQLExplorer from './components/GraphiqlExplorer'
import styles from './index.module.less'
import { useAPIManager } from './store'

async function fetcher(rec: Record<string, unknown>) {
  console.log('rec', JSON.stringify(rec).length)
  try {
    const res = await fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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
  const params = useParams()
  const { dragRef, elRef } = useDragResize({ direction: 'horizontal' })
  const workbenchCtx = useContext(WorkbenchContext)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dataSourceList, setDataSourceList] = useState<string[]>([])
  const {
    query,
    schema,
    schemaAST,
    setQuery,
    refreshSchema,
    setID,
    pureUpdateAPI,
    setWorkbenchContext,
    saved,
    autoSave,
    operationType
  } = useAPIManager(state => ({
    query: state.query,
    schemaAST: state.schemaAST,
    schema: state.schema,
    setQuery: state.setQuery,
    refreshSchema: state.refreshSchema,
    setID: state.setID,
    pureUpdateAPI: state.pureUpdateAPI,
    setWorkbenchContext: state.setWorkbenchContext,
    saved: state.computed.saved,
    autoSave: state.autoSave,
    operationType: state.computed.operationType
  }))
  const editingContent = useRef(query)
  const contentUpdateTimeout = useRef<number>()
  const isEditingRef = useRef(false)
  const explorerRef = useRef<GraphiqlExplorerAction>()

  const tabs = useMemo(() => {
    return (
      <Tabs
        className={styles.tabs}
        centered
        destroyInactiveTabPane
        items={[
          {
            label: '概览',
            key: '1',
            children: <APIFlowChart id={params.id as string} />
          },
          {
            label: '设置',
            key: '2',
            children: params.id ? (
              <ApiConfig operationType={operationType} type="panel" id={Number(params.id)} />
            ) : null
          }
        ]}
      />
    )
  }, [operationType, params.id])

  useEffect(() => {
    const onKeydown = () => {
      isEditingRef.current = true
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
      if (contentUpdateTimeout.current) {
        clearTimeout(contentUpdateTimeout.current)
      }
      // 避免一直输入时更改query导致数据不一致而使得光标跑到最前面
      if (!isEditingRef.current) {
        // 节流设置值
        contentUpdateTimeout.current = setTimeout(() => {
          setQuery(editingContent.current)
        }, 1500)
      }
    },
    [setQuery]
  )

  const editor = useMemo(() => {
    return (
      <GraphiQL
        fetcher={fetcher}
        schema={schema}
        query={query}
        // ref={x => (ref.current = x)}
        onEditQuery={onEditQuery}
        defaultEditorToolsVisibility={false}
      />
    )
  }, [schema, query, onEditQuery])

  const onRefreshSchema = useCallback(async () => {
    setIsRefreshing(true)
    await refreshSchema()
    setIsRefreshing(false)
    message.success('已刷新')
  }, [refreshSchema])

  useEventBus('titleChange', ({ data }) => {
    pureUpdateAPI({ path: data.path })
  })

  useEventBus('compileFinish', refreshSchema)

  useEffect(() => {
    // 3秒后自动保存
    const save = debounce(autoSave, 3000)
    if (!saved) {
      console.log('auto saved')
      save()
    }
  }, [autoSave, saved])

  useEffect(() => {
    setID(params.id!).then(() => {
      explorerRef.current?.manualExpand()
    })
  }, [params.id, setID])

  useEffect(() => {
    setWorkbenchContext(workbenchCtx)
  }, [setWorkbenchContext, workbenchCtx])

  useEffect(() => {
    requests('/dataSource').then(res => {
      // @ts-ignore
      setDataSourceList(res.map(item => item.name))
    })
  }, [])

  return (
    <>
      <Helmet>
        <title>GraphiQL</title>
      </Helmet>
      <div className="bg-white flex flex-col h-full" id="api-editor-container">
        <APIHeader />
        <div className={styles.wrapper}>
          {/* <GraphiQLExplorer schema={schema} query={query} explorerIsOpen={true} onEdit={setQuery} /> */}
          <div className="h-full relative" ref={elRef}>
            <div className="top-0 right-0 bottom-0 w-1 z-2 absolute" ref={dragRef}></div>
            <div className="h-full w-full relative overflow-x-auto">
              <GraphiqlExplorer1
                actionRef={explorerRef}
                schema={schema}
                isLoading={isRefreshing}
                dataSourceList={dataSourceList}
                query={query}
                queryAST={schemaAST}
                onChange={setQuery}
                onRefresh={onRefreshSchema}
              />
            </div>
          </div>
          {editor}
          <div className="h-full w-102 overflow-x-hidden overflow-y-auto">{tabs}</div>
        </div>
      </div>
    </>
  )
}
