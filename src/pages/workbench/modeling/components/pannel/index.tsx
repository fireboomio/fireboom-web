import { AppleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
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
  const { entities } = useEntities()

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
        <div className={styles.title}>数据建模</div>

        <DBSourceSelect sourceOptions={sourceOptions} onChangeSource={onChangeSource} />

        <OperationButtons changeToER={changeToER} />
      </div>

      <div className="flex justify-between items-center p-4 my-3 border-[#5f62691a] border-b-1 border-t-1">
        <span className="text-sm font-medium leading-5">所有实体</span>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button
            className={styles['add-btn']}
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
          />
        </Dropdown>
      </div>

      <div className="mt-3">
        {entities.map(entity => (
          <ModelEntityItem
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
