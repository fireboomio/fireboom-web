import { AppleOutlined, GithubOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import type { MenuProps } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces/modeling'
import { ModelingDispatchContext, ModelingCurrEntityContext } from '@/lib/context'

import styles from '../model-pannel.module.scss'

interface Props {
  entity: Entity
  onClick: () => void
  onToggleDesigner: (entity: Entity) => void
}

export default function ModelEntityItem({ entity, onClick, onToggleDesigner }: Props) {
  const dispatch = useContext(ModelingDispatchContext)
  const [isHovering, setIsHovering] = useImmer(false)
  const [isEditing, setIsEditing] = useImmer(entity.name === '')
  const [visible, setVisible] = useImmer(false)
  const { currEntityId, setCurrEntityId: _ } = useContext(ModelingCurrEntityContext)

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2') {
      setVisible(false)
    }
  }

  function handlePressKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsEditing(false)
      if (entity.name === '') {
        dispatch({ type: 'deleted', data: entity })
      }
    }
  }

  function handleItemDelete(item: Entity) {
    dispatch({ type: 'deleted', data: item })
  }

  function renameEntity(value: string) {
    if (value === '') {
      dispatch({ type: 'deleted', data: entity })
    } else {
      dispatch({ type: 'changed', data: { ...entity, name: value } })
    }

    setIsEditing(false)
  }

  //实现鼠标移出item判断，当菜单显示的时候，仍处于hovering状态
  function leaveItem(visible: boolean) {
    if (visible == false) {
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
              <span className="ml-1.5">重命名</span>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={() => onToggleDesigner(entity)}>
              <AppleOutlined />
              <span className="ml-1.5">编辑</span>
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

  const itemContent = isEditing ? (
    <Input
      onBlur={(e) => renameEntity(e.target.value)}
      // @ts-ignore
      onPressEnter={(e) => renameEntity(e.target.value)}
      onKeyUp={handlePressKey}
      className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
      defaultValue={entity.name}
      autoFocus
      placeholder="请输入实体名"
    />
  ) : (
    <div className="text-sm font-normal leading-4">{entity.name}</div>
  )

  return (
    <div
      className={`flex justify-start items-center py-3 cursor-pointer hover:bg-[#F8F8F9] ${
        entity.id === currEntityId ? 'bg-[#F8F8F9]' : ''
      }`}
      key={entity.id}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onClick={onClick}
      onDoubleClick={() => setIsEditing(true)}
    >
      <MoreOutlined className="mx-0.5" />
      {entity.type === 'model' ? (
        <AppleOutlined className="ml-0.5 mr-2" />
      ) : (
        <GithubOutlined className="ml-0.5 mr-2" />
      )}

      {itemContent}

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
          onClick={(e) => e.stopPropagation()}
          className="m-auto mr-0 pr-2"
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        />
      </Dropdown>
    </div>
  )
}
