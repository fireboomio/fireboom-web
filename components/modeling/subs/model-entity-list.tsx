import { AppleOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import { useContext } from 'react'

import { EntitiesContext } from '../model-context'
import ModelEntityItem from './model-entity-item'

export default function ModelEntityList() {
  const { entities, setEntities } = useContext(EntitiesContext)

  function addTable() {
    setEntities(entities.concat({ id: entities.length + 1, name: '', isEditing: true }))
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={addTable}>模型</span>,
          icon: <AppleOutlined />,
        },
        {
          key: '2',
          label: <span onClick={addTable}>枚举</span>,
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
          <Button type="primary" shape="circle" size="small">
            +
          </Button>
        </Dropdown>
      </div>

      <div className="mt-3">
        {entities.map((entity) => (
          <ModelEntityItem key={entity.id} entity={entity} />
        ))}
      </div>
    </>
  )
}
