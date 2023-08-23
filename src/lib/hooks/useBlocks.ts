import { message } from 'antd'
import { throttle } from 'lodash'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import type { Block } from '@/interfaces/modeling'
import { updateBlocksAction } from '@/lib/actions/PrismaSchemaActions'
import { migratePrismaSchema } from '@/lib/clients/fireBoomAPIOperator'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import { PrismaSchemaBlockOperator } from '@/lib/helpers/PrismaSchemaBlockOperator'

import {
  applyLocalPrismaBlocks,
  applyLocalPrismaSchema,
  refetchPrismaSchema
} from '../helpers/ModelingHelpers'

const errorToast = throttle(() => {
  message.error('当前schema不合法', 3)
}, 3000)

const useBlocks = () => {
  const intl = useIntl()
  const {
    state: { blocks, currentDBSource, originBlocks },
    dispatch
  } = useContext(PrismaSchemaContext)

  const updateAndSaveBlock = (newBlocks: Block[]) => {
    // 临时修复 prisma-ast 库 properties 的问题
    newBlocks.forEach(b => {
      if (b.type === 'model' && !b.properties) {
        b.properties = []
      }
    })
    return migratePrismaSchema(newBlocks, currentDBSource.name)
      .then(() => refetchPrismaSchema(currentDBSource.name, dispatch))
      .catch((err: Error) => {
        dispatch(updateBlocksAction(PrismaSchemaBlockOperator(blocks).cleanEmptyNameEntity()))
        message.error(
          intl.formatMessage(
            { defaultMessage: `数据迁移失败！error: {error}` },
            { error: err.message }
          )
        )
        throw err
      })
  }

  const applyLocalSchema = (schema: string) => {
    try {
      applyLocalPrismaSchema(schema, dispatch)
    } catch (e) {
      // errorToast()
      // console.error(e)
    }
  }
  const applyLocalBlocks = (newBlocks: Block[]) => {
    applyLocalPrismaBlocks(newBlocks, dispatch)
  }
  const refreshBlocks = () => {
    return refetchPrismaSchema(currentDBSource.name, dispatch)
  }

  return {
    blocks: blocks,
    originBlocks: originBlocks,
    updateAndSaveBlock,
    applyLocalSchema,
    applyLocalBlocks,
    refreshBlocks
  }
}

export default useBlocks
