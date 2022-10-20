import { useContext } from 'react'

import { PrismaSchemaContext } from '@/lib/context/prismaSchemaContext'

const useDBSource = () => {
  const {
    state: { currentDBSource }
  } = useContext(PrismaSchemaContext)
  return currentDBSource
}

export default useDBSource
