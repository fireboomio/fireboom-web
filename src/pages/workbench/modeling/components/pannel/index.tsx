import { AppleOutlined } from '@ant-design/icons'
import { printSchema } from '@mrleebo/prisma-ast'
import { Menu } from 'antd'
import { useContext } from 'react'
import type { Updater } from 'use-immer'

import type { DBSourceResp, Entity, ModelingShowTypeT } from '@/interfaces/modeling'
import { UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import useBlocks from '@/lib/hooks/useBlocks'
import useEntities from '@/lib/hooks/useEntities'

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
  const { panel, triggerSyncEditor } = useContext(PrismaSchemaContext)
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

    let currentSchema = printSchema({ type: 'schema', list: blocks })
    currentSchema += initialModel
    applyLocalSchema(currentSchema)
    triggerSyncEditor()
    if (!inEdit) {
      handleSetInEdit(true)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={styles.pannel}>
        <DBSourceSelect sourceOptions={sourceOptions} onChangeSource={onChangeSource} />

        <OperationButtons addNewModel={addNewModelHandler} changeToER={changeToER} />
      </div>

      {Object.keys(delMap).length ? <div>{`已删除${Object.keys(delMap).length}个模块`}</div> : null}
      <div className="mt-1 flex-1 overflow-y-auto">
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
    </div>
  )
}

export default ModelPannel
