import { useContext } from 'react'

import { PrismaSchemaContext } from '@/lib/context/prismaSchemaContext'

const useGraphqlClient = () => {
  const {
    state: { apolloClient }
  } = useContext(PrismaSchemaContext)

  return {
    graphqlClient: apolloClient
  }
}

export default useGraphqlClient
