import { getSchema } from '@mrleebo/prisma-ast'
import { message } from 'antd'
import type { Dispatch } from 'react'

import type { Block } from '@/interfaces/modeling'
import type { AnyAction } from '@/lib/actions/ActionTypes'
import {
  createApolloClient,
  initialPrismaSchemaAction,
  localPrismaSchemaAction,
  refetchPrismaSchemaAction
} from '@/lib/actions/PrismaSchemaActions'
import { fetchPrismaDMF, fetchPrismaSDL } from '@/lib/clients/fireBoomAPIOperator'
import { MAGIC_DELETE_ENTITY_NAME } from '@/lib/constants/fireBoomConstants'
import type { ApiDocuments } from '@/services/a2s.namespace'

export const buildBlocks = (schemaContent: string) =>
  (getSchema(schemaContent).list || [])
    .filter(b => !(b.type === 'model' && b.name === MAGIC_DELETE_ENTITY_NAME))
    .map((item, idx) => ({
      ...item,
      id: idx + 1
    }))

// 每次进入页面或者切换数据源的时候执行
export const initialPrismaSchema = async (
  dataSourceName: string,
  dispatch: Dispatch<AnyAction>,
  selectedDataSource: ApiDocuments.Datasource,
  paramNameRef: React.MutableRefObject<string | undefined>
) => {
  const currentId = paramNameRef.current
  if (currentId !== paramNameRef.current) {
    console.info('数据库name已改变，不再执行后续操作')
    return
  }
  const [dmmf, sdl] = await Promise.all([
    fetchPrismaDMF(dataSourceName),
    fetchPrismaSDL(dataSourceName).catch(() => '')
  ])

  dispatch(
    initialPrismaSchemaAction(buildBlocks(sdl), selectedDataSource, {
      models: dmmf?.datamodel?.models ?? [],
      enums: dmmf?.datamodel?.enums ?? []
    })
  )
}

// 每次完成数据迁移之后执行 refetch
export const refetchPrismaSchema = (dataSourceName: string, dispatch: Dispatch<AnyAction>) =>
  fetchPrismaDMF(dataSourceName).then(({ enums, models, schemaContent }) => {
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
  dataSourceName: string,
  dispatch: React.Dispatch<AnyAction>,
  dataSources: ApiDocuments.Datasource[],
  paramNameRef: React.MutableRefObject<string | undefined>
) => {
  const currentName = paramNameRef.current
  const selectedDataSource = dataSources.find(source => source.name === dataSourceName)
  if (!selectedDataSource) {
    // void message.error(`切换数据源失败！无法找到数据源: id=${dataSourceName}`)
    return Promise.resolve()
  }
  return initialPrismaSchema(dataSourceName, dispatch, selectedDataSource, paramNameRef)
    .then(() => {
      if (currentName !== paramNameRef.current) {
        console.info('数据库id已改变，不再执行后续操作')
        return
      }
      // 获取到schema之后，默认选中第一个model
      console.log('blocks', selectedDataSource)
      dispatch(createApolloClient(dataSourceName))
    })
    .catch((err: Error) => {
      message.error(`Fetch prisma dmf & schema error: ${err.message}`)
      dispatch(initialPrismaSchemaAction([], selectedDataSource, { models: [], enums: [] }))
    })
}
