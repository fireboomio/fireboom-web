import type { DefaultOptions } from '@apollo/client'
import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache } from '@apollo/client'

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
  const abortController = new AbortController()
  const graphqlEndpointForDataSource = BASE_URL + PRISMA_PREVIEW_GRAPHQL_URL + dataSourceId
  const httpLink = createHttpLink({
    uri: graphqlEndpointForDataSource,
    fetchOptions: {
      mode: 'cors',
      signal: abortController.signal
    }
  })
  const headerMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...getHeader()
      }
    }))

    return forward(operation)
  })
  console.log(getHeader())
  return new ApolloClient({
    link: from([headerMiddleware, httpLink]),
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions
  })
}
