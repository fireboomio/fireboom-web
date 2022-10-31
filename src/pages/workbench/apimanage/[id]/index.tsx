/*
 * https://github.com/graphql/graphiql/issues/118
 */

import 'graphiql/graphiql.css'

import { ReloadOutlined } from '@ant-design/icons'
import { message, Tabs, Tooltip } from 'antd'
// @ts-ignore
import GraphiqlExplorer1 from 'graphiql-explorer'
import { debounce } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import ApiConfig from '@/components/apiConfig'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { useEventBus } from '@/lib/event/events'

import APIFlowChart from './components/APIFlowChart'
import APIHeader from './components/APIHeader'
import { GraphiQL } from './components/GraphiQL'
// import GraphiQLExplorer from './components/GraphiqlExplorer'
import styles from './index.module.less'
import { useAPIManager } from './store'

async function fetcher(rec: Record<string, unknown>) {
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
  }
}

export default function APIEditorContainer() {
  const params = useParams()
  console.log('APIEditorContainer refresh')
  const workbenchCtx = useContext(WorkbenchContext)
  const {
    query,
    schema,
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

  useEventBus('titleChange', ({ data }) => {
    pureUpdateAPI({ path: data.path })
  })

  useEventBus('compileFinish', refreshSchema)

  useEffect(() => {
    // 3秒后自动保存
    const save = debounce(autoSave, 3000)
    if (!saved) {
      save()
    }
  }, [autoSave, saved])

  useEffect(() => {
    setID(params.id!)
  }, [params.id, setID])

  useEffect(() => {
    setWorkbenchContext(workbenchCtx)
  }, [setWorkbenchContext, workbenchCtx])

  return (
    <>
      <Helmet>
        <title>GraphiQL</title>
      </Helmet>
      <div className="bg-white flex flex-col h-full" id="api-editor-container">
        <APIHeader />
        <div className={styles.wrapper}>
          {/* <GraphiQLExplorer schema={schema} query={query} explorerIsOpen={true} onEdit={setQuery} /> */}
          <div className="h-full relative">
            <Tooltip title="刷新">
              <ReloadOutlined
                onClick={async () => {
                  await refreshSchema()
                  message.success('已刷新')
                }}
                className="top-3 right-4 absolute"
              />
            </Tooltip>
            <GraphiqlExplorer1
              schema={schema}
              query={query}
              explorerIsOpen={true}
              onEdit={setQuery}
            />
          </div>
          <GraphiQL
            fetcher={fetcher}
            schema={schema}
            query={query}
            // ref={x => (ref.current = x)}
            onEditQuery={setQuery}
            defaultEditorToolsVisibility={false}
          />
          <div className="h-full flex-shrink-0 w-102">{tabs}</div>
        </div>
      </div>
    </>
  )
}
