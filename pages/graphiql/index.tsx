// @ts-ignore
import GraphiQLExplorer from 'graphiql-explorer'
import { useEffect, useRef, useState } from 'react'
import GraphiQL from 'graphiql'
import { GraphQLSchema } from 'graphql'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'
import Layout from '@/components/layout'
import 'graphiql/graphiql.css'
import styles from './index.module.css'

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
    }).then((result: any) => {
      setSchema(buildClientSchema(result.data))
    })
  }, [])

  function fetcher(params: Object): Promise<Object> {
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
        try {
          return JSON.parse(responseBody)
        } catch (e) {
          return responseBody
        }
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
