import { useContext } from 'react'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'

const useGraphqlClient = () => {
  const {
    state: { apolloClient }
  } = useContext(PrismaSchemaContext)

  return {
    graphqlClient: apolloClient
  }
}

export default useGraphqlClient
