import type { Schema } from '@paljs/types'
import { message } from 'antd'
import { useContext } from 'react'

import { saveGqlSchemaAction } from '@/lib/actions/PrismaSchemaActions'
import { fetchPrismaDMF } from '@/lib/clients/fireBoomAPIOperator'
import { PrismaSchemaContext } from '@/lib/context/prismaSchemaContext'

interface TableSchemaType {
  schema: Schema
  refetch: () => void
}

const useTableSchema = (): TableSchemaType => {
  const {
    state: {
      schema,
      currentDBSource: { id }
    },
    dispatch
  } = useContext(PrismaSchemaContext)

  const refetch = () => {
    fetchPrismaDMF(String(id))
      .then(gqlSchema => dispatch(saveGqlSchemaAction(gqlSchema)))
      .catch((err: Error) => message.error(`获取GraphQL schema 失败！Error: ${err.message}`))
  }
  return {
    schema,
    refetch
  }
}

export default useTableSchema
