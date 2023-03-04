import { printSchema } from '@mrleebo/prisma-ast'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import type { Updater } from 'use-immer'

import type { DBSourceResp, Entity, ModelingShowTypeT } from '@/interfaces/modeling'
import { UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import { buildBlocks } from '@/lib/helpers/ModelingHelpers'
import useBlocks from '@/lib/hooks/useBlocks'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useEntities from '@/lib/hooks/useEntities'
import { registerHotkeyHandler } from '@/services/hotkey'

import DBSourceSelect from './db-source-select'
import ModelEntityItem from './entity-item'
import OperationButtons from './operation-buttons'
import styles from './pannel.module.less'

interface Props {
  sourceOptions: DBSourceResp[]
  onChangeSource: (value: string) => void
  onClickEntity: (entity: Entity) => void
  onToggleDesigner: (entity: Entity) => void
  changeToER: () => void
  addNewModel: () => void
  addNewEnum: () => void
  setShowType: Updater<ModelingShowTypeT>
}

const ModelPannel = ({
  sourceOptions,
  onChangeSource,
  onClickEntity,
  onToggleDesigner,
  changeToER,
  addNewModel,
  setShowType
}: Props) => {
  const intl = useIntl()
  const { entities, editMap, newMap, delMap } = useEntities()
  const { changeToEntityById } = useCurrentEntity()
  const { panel, triggerSyncEditor, dispatch } = useContext(PrismaSchemaContext)
  const { handleClickEntity } = panel
  // const ctx = useContext(PrismaSchemaContext)
  const { handleSetInEdit, inEdit } = panel || {}
  const { id: paramId } = useParams()

  const { blocks, applyLocalSchema, applyLocalBlocks } = useBlocks()

  const addNewModelHandler = async () => {
    const newName = `${UNTITLED_NEW_ENTITY}${
      Math.max(
        0,
        ...entities.map(e => {
          const match = e.name.match(new RegExp(`${UNTITLED_NEW_ENTITY}(\\d*)`))
          return match ? Number(match[1]) : 0
        })
      ) + 1
    }`
    const initialModel = `\nmodel ${newName} {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}
`

    // 构造新的blocks
    let currentSchema = printSchema({ type: 'schema', list: blocks })
    currentSchema += initialModel
    const newBlocks = buildBlocks(currentSchema)
    // 保存到本地
    applyLocalBlocks(newBlocks)
    // 触发编辑器同步
    triggerSyncEditor()
    setTimeout(() => {
      handleClickEntity(newBlocks[newBlocks.length - 1])
      handleSetInEdit(true)
    }, 100)
  }

  // 快捷键
  useEffect(() => {
    return registerHotkeyHandler('alt+n,^+n', () => {
      addNewModelHandler()
    })
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className={styles.pannel}>
        <DBSourceSelect sourceOptions={sourceOptions} onChangeSource={onChangeSource} />

        {paramId && paramId !== '0' && (
          <OperationButtons addNewModel={addNewModelHandler} changeToER={changeToER} />
        )}
      </div>

      <div className="flex-1 mt-1 overflow-y-auto">
        {entities.map(entity => (
          <ModelEntityItem
            editFlag={editMap[entity.name]}
            newFlag={newMap[entity.name]}
            setShowType={setShowType}
            key={entity.id}
            entity={entity}
            onClick={() => onClickEntity(entity)}
            onToggleDesigner={onToggleDesigner}
          />
        ))}
      </div>
      {Object.keys(delMap).length ? (
        <div className="bg-[#f7f7f7] rounded-4px m-2 px-3 text-[#666] leading-32px">
          {intl.formatMessage({
            defaultMessage: '系统检测到您可能删除或重命名了模型，迁移后将导致数据丢失，请谨慎操作'
          })}
        </div>
      ) : null}
    </div>
  )
}

export default ModelPannel
