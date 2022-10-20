import { message } from 'antd'
import { useContext } from 'react'

import type { Block } from '@/interfaces/modeling'
import { updateBlocksAction } from '@/lib/actions/PrismaSchemaActions'
import { migratePrismaSchema } from '@/lib/clients/fireBoomAPIOperator'
import { PrismaSchemaContext } from '@/lib/context/prismaSchemaContext'
import { PrismaSchemaBlockOperator } from '@/lib/helpers/PrismaSchemaBlockOperator'

import { refetchPrismaSchema } from '../helpers/ModelingHelpers'

const useBlocks = () => {
  const {
    state: { blocks, currentDBSource },
    dispatch
  } = useContext(PrismaSchemaContext)

  const updateAndSaveBlock = (newBlocks: Block[]) => {
    // 临时修复 prisma-ast 库 properties 的问题
    newBlocks.forEach(b => {
      if (b.type === 'model' && !b.properties) {
        b.properties = []
      }
    })
    return migratePrismaSchema(newBlocks, currentDBSource.id)
      .then(() => refetchPrismaSchema(String(currentDBSource.id), dispatch))
      .catch((err: Error) => {
        dispatch(updateBlocksAction(PrismaSchemaBlockOperator(blocks).cleanEmptyNameEntity()))
        void message.error(`数据迁移失败！error: ${err.message}`)
        throw err
      })
  }

  return {
    blocks: blocks,
    updateAndSaveBlock
  }
}

export default useBlocks
