/*
 * https://github.com/graphql/graphiql/issues/118
 */

import { GraphiQL } from 'graphiql'
// @ts-ignore
import GraphiQLExplorer from 'graphiql-explorer'
import { GraphQLSchema, buildClientSchema, getIntrospectionQuery } from 'graphql'
import { useEffect, useRef, useState } from 'react'

import Layout from '@/components/layout'

import 'graphiql/graphiql.css'
import styles from './index.module.scss'

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

export default function App() {
  const [schema, setSchema] = useState<GraphQLSchema>()
  const [query, setQuery] = useState<string | undefined>(DEFAULT_QUERY)

  const ref = useRef<GraphiQL | null>()

  useEffect(() => {
    fetcher({
      query: getIntrospectionQuery(),
    })
      // @ts-ignore
      .then((result: Record<string, unknown>) => setSchema(buildClientSchema(result.data)))
      .catch((err: Error) => {
        throw err
      })
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function fetcher(params: Record<string, unknown>): Promise<any> {
    return fetch('http://localhost:9991/api/main/graphql', {
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

  return (
    <Layout>
      <div className={`${styles['global']} graphiql-container`}>
        <GraphiQLExplorer schema={schema} query={query} explorerIsOpen={true} onEdit={setQuery} />
        <GraphiQL
          fetcher={fetcher}
          schema={schema}
          query={query}
          ref={(x) => (ref.current = x)}
          onEditQuery={setQuery}
        >
          <GraphiQL.Toolbar>
            <GraphiQL.Button
              onClick={() => ref.current?.ref?.props.prettify()}
              label="Prettify"
              title="Prettify Query (Shift-Ctrl-P)"
            />
            <GraphiQL.Button
              onClick={() => ref.current?.ref?.props.merge()}
              label="Merge"
              title="Merge Query (Shift-Ctrl-M)"
            />
            <GraphiQL.Button
              onClick={() => ref.current?.ref?.props.historyContext?.toggle()}
              label="History"
              title="Show History"
            />
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    </Layout>
  )
}
