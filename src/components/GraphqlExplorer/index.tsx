import clsx from 'clsx'
import { type GraphQLSchema, type IntrospectionQuery, buildClientSchema } from 'graphql'
import { useMemo } from 'react'

import Breadcrumb from './Breadcrumb'
import GraphQLExplorerProvider from './provider'
import SchemaPanel from './SchemaPanel'
import './index.css'

export interface GraphqlExplorerProps {
  className?: string
  /**
   * The GraphQL schema
   */
  schema?: GraphQLSchema | IntrospectionQuery
  /**
   * The query
   */
  query?: string
  /**
   * Is loading schema or query
   */
  loading?: boolean
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
  console.log(schema)
  window.schema = schema

  return (
    <GraphQLExplorerProvider>
      <div
        className={clsx(
          'graphql-explorer pt-2 flex flex-col px-3 h-full bg-[#f7f7f7] text-dark-800 font-mono select-none overflow-y-auto',
          props.className
        )}
      >
        <Breadcrumb />
        {schema && <SchemaPanel query={query} mutation={mutation} subscription={subscription} />}
      </div>
    </GraphQLExplorerProvider>
  )
}

export default GraphqlExplorer
