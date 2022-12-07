import { AppleOutlined } from '@ant-design/icons'
import { printSchema } from '@mrleebo/prisma-ast'
import { Menu } from 'antd'
import { useContext, useEffect } from 'react'
import type { Updater } from 'use-immer'

import type { DBSourceResp, Entity, ModelingShowTypeT } from '@/interfaces/modeling'
import { updateCurrentEntityIdAction } from '@/lib/actions/PrismaSchemaActions'
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
  onChangeSource: (value: number) => void
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
  const { entities, editMap, newMap, delMap } = useEntities()
  const { changeToEntityById } = useCurrentEntity()
  const { panel, triggerSyncEditor, dispatch } = useContext(PrismaSchemaContext)
  // const ctx = useContext(PrismaSchemaContext)
  const { handleSetInEdit, inEdit } = panel || {}

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={addNewModel}>模型</span>,
          icon: <AppleOutlined />
        }
        // 此处不支持新增枚举，改为在model中弹窗新增
        // {
        //   key: '2',
        //   label: <span onClick={addNewEnum}>枚举</span>,
        //   icon: <AppleOutlined/>,
        // },
      ]}
    />
  )

  const { blocks, applyLocalSchema, applyLocalBlocks } = useBlocks()

  const addNewModelHandler = () => {
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
  updatedAt DateTime
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
    // 如果当前不是编辑模式，切换到编辑模式
    if (!inEdit) {
      handleSetInEdit(true)
    }
    setTimeout(() => {
      dispatch(updateCurrentEntityIdAction(newBlocks[newBlocks.length - 1].id))
    }, 100)
  }

  // 快捷键
  useEffect(() => {
    return registerHotkeyHandler('alt+n', () => {
      addNewModelHandler()
    })
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className={styles.pannel}>
        <DBSourceSelect sourceOptions={sourceOptions} onChangeSource={onChangeSource} />

        <OperationButtons addNewModel={addNewModelHandler} changeToER={changeToER} />
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
        <div className="bg-[#f7f7f7] rounded-4px m-2 px-3 text-[#666] leading-32px">{`已删除${
          Object.keys(delMap).length
        }个模块`}</div>
      ) : null}
    </div>
  )
}

export default ModelPannel
