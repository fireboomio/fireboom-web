import { AppleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import { useContext } from 'react'

import { ModelingContext } from '@/lib/modeling-context'

import ModelEntityItem from './model-entity-item'
import styles from './model-entity-list.module.scss'

const nextId = 5

export default function ModelEntityList() {
  const { entities, setEntities } = useContext(ModelingContext)

  function addModel() {
    setEntities(entities.concat({ id: nextId, name: '', type: 'model', properties: [] }))
  }

  function addEnum() {
    setEntities(entities.concat({ id: nextId, name: '', type: 'enum', enumerators: [] }))
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={addModel}>模型</span>,
          icon: <AppleOutlined />,
        },
        {
          key: '2',
          label: <span onClick={addEnum}>枚举</span>,
          icon: <AppleOutlined />,
        },
      ]}
    />
  )

  return (
    <>
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
        {entities.map((entity) => (
          <ModelEntityItem key={entity.name} entity={entity} />
        ))}
      </div>
    </>
  )
}
