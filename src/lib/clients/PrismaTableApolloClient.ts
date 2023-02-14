import type { DefaultOptions } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'

import { BASE_URL, PRISMA_PREVIEW_GRAPHQL_URL } from '@/lib/constants/fireBoomConstants'

import { getHeader } from '../fetchers'

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

export const buildPrismaTableApolloClientByDataSourceId = (dataSourceId: string) => {
  const graphqlEndpointForDataSource = BASE_URL + PRISMA_PREVIEW_GRAPHQL_URL + dataSourceId
  return new ApolloClient({
    headers: getHeader(),
    uri: graphqlEndpointForDataSource,
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions
  })
}
