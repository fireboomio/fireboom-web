import './index.css'

import clsx from 'clsx'
import { type GraphQLSchema, type IntrospectionQuery, buildClientSchema } from 'graphql'
import { useMemo } from 'react'

import Breadcrumb from './Breadcrumb'
import GraphQLExplorerProvider from './provider'
import SchemaPanel from './SchemaPanel'
import { parseQuery } from './utils'

export interface GraphqlExplorerProps {
  className?: string
  /**
   * Operation name
   */
  operationName?: string
  /**
   * The GraphQL schema
   */
  schema?: GraphQLSchema | IntrospectionQuery
  /**
   * The query string
   */
  query?: string
  /**
   * Is loading schema or query
   */
  loading?: boolean
  /**
   * 自动滚动到 fields 位置
   */
  autoScroll?: boolean
  /**
   * Editor content changed event
   */
  onChange?: (query: string) => void
  /**
   * Refresh event
   */
  onRefresh?: () => void
}

const GraphqlExplorer = (props: GraphqlExplorerProps) => {
  const schema = useMemo(() => {
    if (!props.schema) {
      return null
    }
    if ('__schema' in props.schema) {
      return buildClientSchema(props.schema)
    }
    return props.schema
  }, [props.schema])
  const query = useMemo(() => {
    if (schema) {
      return schema.getQueryType()
    }
    return null
  }, [schema])
  const mutation = useMemo(() => {
    if (schema) {
      return schema.getMutationType()
    }
    return null
  }, [schema])
  const subscription = useMemo(() => {
    if (schema) {
      return schema.getSubscriptionType()
    }
    return null
  }, [schema])
  console.log(schema, props.query, parseQuery(props.query ?? ''))
  window.schema = schema

  return (
    <GraphQLExplorerProvider
      operationName={props.operationName}
      query={props.query}
      onChange={props.onChange}
    >
      <div
        className={clsx(
          'graphql-explorer pt-2 flex flex-col px-3 h-full bg-[#f7f7f7] text-dark-800 font-mono select-none overflow-y-auto',
          props.className
        )}
      >
        <Breadcrumb />
        {schema && (
          <SchemaPanel
            // value={props.value}
            query={query}
            mutation={mutation}
            subscription={subscription}
          />
        )}
      </div>
    </GraphQLExplorerProvider>
  )
}

export default GraphqlExplorer
