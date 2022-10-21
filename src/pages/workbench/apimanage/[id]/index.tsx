/*
 * https://github.com/graphql/graphiql/issues/118
 */

import 'graphiql/graphiql.css'

import { Tabs } from 'antd'
// @ts-ignore
import GraphiqlExplorer1 from 'graphiql-explorer'
import type { GraphQLSchema, IntrospectionQuery } from 'graphql'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import ApiConfig from '@/components/apiConfig'
import requests from '@/lib/fetchers'

import APIFlowChart from './components/APIFlowChart'
import APIHeader from './components/APIHeader'
import { GraphiQL } from './components/GraphiQL'
import { parseSchemaAST } from './components/GraphiQL/utils'
import type { APIDesc } from './hooks'
import { APIContext, useAPIManager } from './hooks'
// import GraphiQLExplorer from './components/GraphiqlExplorer'
import styles from './index.module.less'

const DEFAULT_QUERY = `# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that start
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#     Merge Query:  Shift-Ctrl-M (or press the merge button above)
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
`

export function APIEditorContainer({ id }: { id: string | undefined }) {
  const params = useParams()
  const { apiDesc, fetcher, query, schema, setQuery } = useAPIManager()
  // function save() {
  //   const content = ref.current?.props.query as string
  //   return onSave(content)
  // }
  return (
    <>
      <Helmet>
        <title>GraphiQL</title>
      </Helmet>
      <div className="bg-white flex flex-col h-full">
        <APIHeader />
        <div className={styles.wrapper}>
          {/* <GraphiQLExplorer schema={schema} query={query} explorerIsOpen={true} onEdit={setQuery} /> */}
          <GraphiqlExplorer1
            style={{ width: '258px !important' }}
            schema={schema}
            query={query}
            explorerIsOpen={true}
            onEdit={setQuery}
          />
          <GraphiQL
            fetcher={fetcher}
            schema={schema}
            query={query}
            // ref={x => (ref.current = x)}
            onEditQuery={setQuery}
            defaultEditorToolsVisibility={false}
          />
          <div>
            <Tabs
              className="h-full bg-[#F8F9FD]"
              centered
              items={[
                { label: '概览', key: '1', children: <APIFlowChart id={params.id as string} /> },
                {
                  label: '设置',
                  key: '2',
                  children: id ? <ApiConfig type="panel" id={Number(id)} /> : null
                }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default function APIEditorProvider() {
  const [apiDesc, setAPIDesc] = useState<APIDesc>()
  const params = useParams()
  const [schema, setSchema] = useState<GraphQLSchema | null>(null)
  const [query, setQuery] = useState<string>(DEFAULT_QUERY)
  const [saved, setSaved] = useState(true)

  const fetcher = useCallback(
    async (rec: Record<string, unknown>) => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id]
  )

  const schemaAST = useMemo(() => {
    try {
      return parseSchemaAST(query)
    } catch (error) {
      //
    }
  }, [query])

  const updateAPI = (newAPI: Partial<APIDesc>) => {
    return requests.put(`/operateApi/${params.id}`, newAPI).then(resp => {
      if (resp) {
        // @ts-ignore
        setAPIDesc({ ...(apiDesc ?? {}), ...newAPI })
      }
    })
  }

  const updateContent = (content: string) => {
    return requests.put(`/operateApi/content/${params.id}`, { content }).then(resp => {
      if (resp) {
        setQuery(content ?? '')
        // @ts-ignore
        setAPIDesc({ ...(apiDesc ?? {}), content })
        setSaved(true)
      }
    })
  }

  const refreshAPI = useCallback(async () => {
    const [api, setting] = await Promise.all([
      requests.get(`/operateApi/${params.id}`),
      requests.get(`/operateApi/setting/${params.id}`, { params: { settingType: 1 } })
    ])
    // @ts-ignore
    setAPIDesc({ ...api, setting })
    // @ts-ignore
    setQuery(api.content)
  }, [params.id])

  useEffect(() => {
    refreshAPI()
    // 获取 graphql 集合
    fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: getIntrospectionQuery() })
    })
      .then(resp => resp.json())
      .then(res => {
        setSchema(buildClientSchema(res.data as IntrospectionQuery))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <APIContext.Provider
      value={{
        apiDesc,
        query,
        setQuery,
        schema,
        fetcher,
        schemaAST,
        updateAPI,
        updateContent,
        refreshAPI,
        saved,
        setSaved
      }}
    >
      <APIEditorContainer id={params.id} />
    </APIContext.Provider>
  )
}
