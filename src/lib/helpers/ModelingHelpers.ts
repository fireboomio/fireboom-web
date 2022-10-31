import { getSchema } from '@mrleebo/prisma-ast'
import { message } from 'antd'
import type { Dispatch } from 'react'

import type { DBSourceResp } from '@/interfaces/modeling'
import type { AnyAction } from '@/lib/actions/ActionTypes'
import {
  createApolloClient,
  initialPrismaSchemaAction,
  refetchPrismaSchemaAction
} from '@/lib/actions/PrismaSchemaActions'
import { fetchPrismaDMF } from '@/lib/clients/fireBoomAPIOperator'
import { MAGIC_DELETE_ENTITY_NAME } from '@/lib/constants/fireBoomConstants'

const buildBlocks = (schemaContent: string) =>
  (getSchema(schemaContent).list || [])
    .filter(b => !(b.type === 'model' && b.name === MAGIC_DELETE_ENTITY_NAME))
    .map((item, idx) => ({
      ...item,
      id: idx + 1
    }))

// 每次进入页面或者切换数据源的时候执行
export const initialPrismaSchema = (
  dataSourceId: string,
  dispatch: Dispatch<AnyAction>,
  selectedDataSource: DBSourceResp
) =>
  fetchPrismaDMF(dataSourceId).then(({ enums, models, schemaContent }) => {
    dispatch(
      initialPrismaSchemaAction(buildBlocks(schemaContent), selectedDataSource, { models, enums })
    )
  })

// 每次完成数据迁移之后执行 refetch
export const refetchPrismaSchema = (dataSourceId: string, dispatch: Dispatch<AnyAction>) =>
  fetchPrismaDMF(dataSourceId).then(({ enums, models, schemaContent }) => {
    dispatch(refetchPrismaSchemaAction(buildBlocks(schemaContent), { models, enums }))
  })

export const fetchAndSaveToPrismaSchemaContext = (
  dataSourceId: number,
  dispatch: Dispatch<AnyAction>,
  dataSources: DBSourceResp[]
) => {
  const selectedDataSource = dataSources.find(source => source.id === dataSourceId)
  if (!selectedDataSource) {
    // void message.error(`切换数据源失败！无法找到数据源: id=${dataSourceId}`)
    return
  }
  initialPrismaSchema(String(dataSourceId), dispatch, selectedDataSource)
    .then(() => dispatch(createApolloClient(dataSourceId)))
    .catch((err: Error) => message.error(`获取prisma dmf & schema 失败！Error: ${err.message}`))
}
