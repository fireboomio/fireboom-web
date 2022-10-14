/* eslint-disable import/order */
/*
 * https://github.com/graphql/graphiql/issues/118
 */

// @ts-ignore
import GraphiqlExplorer1 from 'graphiql-explorer'
import { GraphQLSchema, buildClientSchema, getIntrospectionQuery } from 'graphql'
import 'graphiql/graphiql.css'

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import FlowChart from '@/components/charts/FlowChart'

import { GraphiQL } from './components/GraphiQL'

// import GraphiQLExplorer from './components/GraphiqlExplorer'

import styles from './index.module.less'
import APIHeader from './components/APIHeader'
import { APIContext } from './hooks'
import requests from '@/lib/fetchers'
import { useParams } from 'react-router-dom'

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
  const [schema, setSchema] = useState<GraphQLSchema>()
  const [query, setQuery] = useState<string | undefined>(DEFAULT_QUERY)

  useEffect(() => {
    fetcher({
      query: getIntrospectionQuery(),
    })
      // @ts-ignore
      .then((result: Record<string, unknown>) => setSchema(buildClientSchema(result.data)))
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function fetcher(params: Record<string, unknown>): Promise<any> {
    // return fetch(url ?? '/app/main/graphql', {
    return fetch('https://graphql-weather-api.herokuapp.com/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(function (response) {
        return response.text()
      })
      .then(function (responseBody) {
        return JSON.parse(responseBody) as unknown
      })
      .catch((err: Error) => {
        throw err
      })
  }

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
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    void requests.get(`/operateApi/${params.id}`).then(resp => {
      return setAPIDesc(resp)
    })
  }, [])

  return (
    <APIContext.Provider value={apiDesc}>
      <APIEditorContainer />
    </APIContext.Provider>
  )
}
