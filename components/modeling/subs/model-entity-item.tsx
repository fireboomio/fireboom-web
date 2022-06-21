import { AppleOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces/modeling'

import { EntitiesContext } from '../model-context'

interface Props {
  entity: Entity
}

export default function ModelEntityItem({ entity }: Props) {
  const { entities, setEntities } = useContext(EntitiesContext)
  const [isEditing, setIsEditing] = useImmer(false)

  function handleItemDelete(item: Entity) {
    setEntities(entities.filter((t) => t.name !== item.name))
  }

  function handleItemEdit(text: string) {
    updateEntity({ id: entity.id, name: text })
    setIsEditing(false)
  }

  function updateEntity(item: Entity) {
    setEntities((draft) => {
      const entity = draft.find((x) => x.id === item.id)
      if (entity) {
        entity.name = item.name
      }
    })
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={() => setIsEditing(!isEditing)}>编辑</span>,
        },
        {
          key: '2',
          label: <span>查看</span>,
        },
        {
          key: '3',
          label: <span onClick={() => handleItemDelete(entity)}>删除</span>,
        },
      ]}
    />
  )

  return (
    <div className="flex justify-start items-center py-10px" key={entity.name}>
      <MoreOutlined className="mx-2px"></MoreOutlined>
      <AppleOutlined className="ml-2px mr-2"></AppleOutlined>
      {isEditing ? (
        <Input
          onBlur={(e) => handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => handleItemEdit(e.target.value as string)}
          className="text-sm font-normal leading-16px h-22px w-200px"
          defaultValue={entity.name}
        />
      ) : (
        <div className="text-sm font-normal leading-16px">{entity.name}</div>
      )}

      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <MoreOutlined className="m-auto mr-0 pr-2"></MoreOutlined>
      </Dropdown>
    </div>
  )
}
