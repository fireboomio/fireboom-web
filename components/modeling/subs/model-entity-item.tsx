import { AppleOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm, message } from 'antd'
import type { MenuProps } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces'

import { EntitiesContext } from '../model-context'
import styles from '../model-pannel.module.scss'

interface Props {
  entity: Entity
}

export default function ModelEntityItem({ entity }: Props) {
  const { entities, setEntities } = useContext(EntitiesContext)
  const [isEditing, setIsEditing] = useImmer(entity.isEditing)
  const [isHovering, setIsHovering] = useImmer(false)
  const [visible, setVisible] = useImmer(false)

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '1' || e.key === '2') {
      setVisible(false)
    }
  }

  function handleItemEdit(text: string) {
    if (text.trim() == '') {
      message.destroy()
      void message.error('实体名不能为空，请重新输入', 1)
    } else {
      updateEntity({ id: entity.id, name: text })
      setIsEditing(false)
    }
  }

  function handleItemDelete(item: Entity) {
    setEntities(entities.filter((t) => t.name !== item.name))
  }

  function updateEntity(item: Entity) {
    setEntities((draft) => {
      const entity = draft.find((x) => x.id === item.id)
      if (entity) {
        entity.name = item.name
      }
    })
  }

  //实现鼠标移出item判断，当菜单显示的时候，仍处于hovering状态
  function leaveItem(MenuVisible: boolean) {
    if (MenuVisible == false) {
      setIsHovering(false)
      setVisible(false)
    }
  }

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: '1',
          label: (
            <div onClick={() => setIsEditing(!isEditing)}>
              <AppleOutlined />
              <span className="ml-1.5">编辑</span>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div>
              <AppleOutlined />
              <span className="ml-1.5">查看</span>
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <Popconfirm
              placement="right"
              title="确认删除该实体吗？"
              onConfirm={() => handleItemDelete(entity)}
              okText="删除"
              cancelText="取消"
              onCancel={() => setVisible(false)}
              overlayClassName={styles['delete-label']}
              okType={'danger'}
            >
              <div>
                <AppleOutlined />
                <span className="ml-1.5">删除</span>
              </div>
            </Popconfirm>
          ),
        },
      ]}
    />
  )

  return (
    <div
      className="flex justify-start items-center py-3"
      style={isHovering ? { background: '#F8F8F9' } : {}}
      key={entity.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
    >
      <MoreOutlined className="mx-2px" />
      <AppleOutlined className="ml-2px mr-2" />

      {isEditing ? (
        <Input
          onBlur={(e) => handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => handleItemEdit(e.target.value as string)}
          className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
          defaultValue={entity.name}
          autoFocus
          placeholder="请输入实体名"
        />
      ) : (
        <div className="text-sm font-normal leading-4">{entity.name}</div>
      )}

      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
        visible={visible}
        onVisibleChange={(v) => {
          setVisible(v)
          leaveItem(v)
        }}
      >
        <MoreOutlined
          className="m-auto mr-0 pr-2"
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        />
      </Dropdown>
    </div>
  )
}
