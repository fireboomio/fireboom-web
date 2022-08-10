/*
 * https://github.com/graphql/graphiql/issues/118
 */

import { GraphiQL } from 'graphiql'
// @ts-ignore
import GraphiQLExplorer from 'graphiql-explorer'
import { GraphQLSchema, buildClientSchema, getIntrospectionQuery } from 'graphql'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

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

interface Props {
  data: string
  onSave: (query: string) => void
}
export default function App({ data, onSave }: Props) {
  const [schema, setSchema] = useState<GraphQLSchema>()
  const [query, setQuery] = useState<string | undefined>(data ?? DEFAULT_QUERY)

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

  useEffect(() => {
    setQuery(data)
  }, [data])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function fetcher(params: Record<string, unknown>): Promise<any> {
    return fetch('/app/main/graphql', {
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

  function save() {
    // @ts-ignore
    const content = ref.current?.ref?.props.query as string
    // const path = router.query.path

    // void requests
    //   .put('/operateApi', { path: path, content: content })
    //   .then((_) => void message.success('保存成功'))

    return onSave(content)
  }

  return (
    <>
      <Head>
        <title>GraphiQL</title>
      </Head>

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
            <GraphiQL.Button onClick={save} label="Save" title="Save" />
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    </>
  )
}
