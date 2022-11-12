import { AppleOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import type { Updater } from 'use-immer'

import type { DBSourceResp, Entity, ModelingShowTypeT } from '@/interfaces/modeling'
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

  return (
    <>
      <div className={styles.pannel}>
        <DBSourceSelect sourceOptions={sourceOptions} onChangeSource={onChangeSource} />

        <OperationButtons addNewModel={addNewModel} changeToER={changeToER} />
      </div>

      {Object.keys(delMap).length ? <div>{`已删除${Object.keys(delMap).length}个模块`}</div> : null}
      <div className="mt-1">
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
    </>
  )
}

export default ModelPannel
