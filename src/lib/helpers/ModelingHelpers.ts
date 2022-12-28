import { getSchema } from '@mrleebo/prisma-ast'
import { message } from 'antd'
import type { Dispatch } from 'react'

import type { Block, DBSourceResp } from '@/interfaces/modeling'
import type { AnyAction } from '@/lib/actions/ActionTypes'
import {
  createApolloClient,
  initialPrismaSchemaAction,
  localPrismaSchemaAction,
  refetchPrismaSchemaAction
} from '@/lib/actions/PrismaSchemaActions'
import { fetchPrismaDMF } from '@/lib/clients/fireBoomAPIOperator'
import { MAGIC_DELETE_ENTITY_NAME } from '@/lib/constants/fireBoomConstants'

export const buildBlocks = (schemaContent: string) =>
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
  selectedDataSource: DBSourceResp,
  paramIdRef: React.MutableRefObject<string | undefined>
) => {
  const currentId = paramIdRef.current
  return fetchPrismaDMF(dataSourceId).then(({ enums, models, schemaContent }) => {
    if (currentId !== paramIdRef.current) {
      console.info('数据库id已改变，不再执行后续操作')
      return
    }
    dispatch(
      initialPrismaSchemaAction(buildBlocks(schemaContent), selectedDataSource, { models, enums })
    )
  })
}

// 每次完成数据迁移之后执行 refetch
export const refetchPrismaSchema = (dataSourceId: string, dispatch: Dispatch<AnyAction>) =>
  fetchPrismaDMF(dataSourceId).then(({ enums, models, schemaContent }) => {
    dispatch(refetchPrismaSchemaAction(buildBlocks(schemaContent), { models, enums }))
  })
// 使用本地schema
export const applyLocalPrismaSchema = (schemaContent: string, dispatch: Dispatch<AnyAction>) => {
  dispatch(localPrismaSchemaAction(buildBlocks(schemaContent)))
}
// 使用本地schema
export const applyLocalPrismaBlocks = (blocks: Block[], dispatch: Dispatch<AnyAction>) => {
  dispatch(localPrismaSchemaAction(blocks))
}

export const fetchAndSaveToPrismaSchemaContext = (
  dataSourceId: number,
  dispatch: React.Dispatch<AnyAction>,
  dataSources: DBSourceResp[],
  paramIdRef: React.MutableRefObject<string | undefined>
) => {
  const currentId = paramIdRef.current
  const selectedDataSource = dataSources.find(source => source.id === dataSourceId)
  if (!selectedDataSource) {
    // void message.error(`切换数据源失败！无法找到数据源: id=${dataSourceId}`)
    return Promise.resolve()
  }
  return initialPrismaSchema(String(dataSourceId), dispatch, selectedDataSource, paramIdRef)
    .then(() => {
      if (currentId !== paramIdRef.current) {
        console.info('数据库id已改变，不再执行后续操作')
        return
      }
      // 获取到schema之后，默认选中第一个model
      console.log('blocks', selectedDataSource)
      dispatch(createApolloClient(dataSourceId))
    })
    .catch((err: Error) => {
      message.error(`Fetch prisma dmf & schema error: ${err.message}`)
      dispatch(initialPrismaSchemaAction([], selectedDataSource, { models: [], enums: [] }))
    })
}
