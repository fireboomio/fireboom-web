/*
 * https://github.com/graphql/graphiql/issues/118
 */

import 'graphiql/graphiql.css'

// @ts-ignore
import GraphiqlExplorer1 from 'graphiql-explorer'
import type { GraphQLSchema, IntrospectionQuery } from 'graphql'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import FlowChart from '@/components/charts/FlowChart'
import requests from '@/lib/fetchers'

import APIHeader from './components/APIHeader'
import { GraphiQL } from './components/GraphiQL'
import { parseSchemaAST } from './components/GraphiQL/utils'
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

export function APIEditorContainer() {
  const { fetcher, query, schema, setQuery } = useAPIManager()
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
          <FlowChart />
        </div>
      </div>
    </>
  )
}

export default function APIEditorProvider() {
  const [apiDesc, setAPIDesc] = useState()
  const params = useParams()
  const [schema, setSchema] = useState<GraphQLSchema | null>(null)
  const [query, setQuery] = useState<string>(DEFAULT_QUERY)

  useCallback(() => {}, [])

  const fetcher = useCallback(
    async (rec: Record<string, unknown>) => {
      try {
        // const res = await fetch(`/model/graphql/${params.id}`, {
        const res = await fetch('https://graphql-weather-api.herokuapp.com/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(rec)
        }).then(resp => resp.json())
        setSchema(buildClientSchema(res.data as IntrospectionQuery))
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

  useEffect(() => {
    void requests.get(`/operateApi/${params.id}`).then(resp => {
      // @ts-ignore
      setAPIDesc(resp)
      // @ts-ignore
      setQuery(resp.content)
    })
    fetcher({ query: getIntrospectionQuery() })
  }, [params.id])

  return (
    <APIContext.Provider
      value={{
        apiDesc,
        query,
        setQuery,
        schema,
        fetcher,
        schemaAST
      }}
    >
      <APIEditorContainer />
    </APIContext.Provider>
  )
}
