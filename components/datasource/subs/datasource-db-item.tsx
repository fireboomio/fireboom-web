import { AppleOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm, message } from 'antd'
import type { MenuProps } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces'
import { DatasourceDispatchContext } from '@/lib/context'

import styles from '../datasource-pannel.module.scss'

interface Props {
  datasourceItem: DatasourceItem
  onClickItem: (dsItem: DatasourceItem) => void
  Datasourcetype: string
}

export default function DatasourceDBItem({ datasourceItem, onClickItem }: Props) {
  const dispatch = useContext(DatasourceDispatchContext)
  const [isEditing, setIsEditing] = useImmer(datasourceItem.isEditing)
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
      updateEntity({ id: datasourceItem.id, name: text, isEditing: false, type: 'Datasourcetype' })
      setIsEditing(false)
    }
  }

  function handleItemDelete(item: DatasourceItem) {
    dispatch({ type: 'deleted', data: item })
  }

  function updateEntity(item: DatasourceItem) {
    dispatch({ type: 'changed', data: { ...item, name: item.name } })
    setIsEditing(false)
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
              onConfirm={() => handleItemDelete(datasourceItem)}
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
      className="flex justify-start items-center py-2.5 pl-3"
      style={isHovering ? { background: '#F8F8F9' } : {}}
      key={datasourceItem.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onClick={() => {
        onClickItem(datasourceItem)
      }}
    >
      <AppleOutlined className="ml-2px mr-2" />

      {isEditing ? (
        <Input
          onBlur={(e) => handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => handleItemEdit(e.target.value as string)}
          className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
          defaultValue={datasourceItem.name}
          autoFocus
          placeholder="请输入外部数据源名"
        />
      ) : (
        <div
          onClick={() => {
            // setIsEditing(true)
          }}
          className="text-sm font-normal leading-4"
        >
          {datasourceItem.name}
        </div>
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
