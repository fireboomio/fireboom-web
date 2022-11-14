import type { Schema } from '@paljs/types'
import { useContext } from 'react'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'

interface TableSchemaType {
  schema: Schema
}

const useTableSchema = (): TableSchemaType => {
  const {
    state: { schema }
  } = useContext(PrismaSchemaContext)

  return {
    schema
  }
}

export default useTableSchema
