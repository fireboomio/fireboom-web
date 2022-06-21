import { AppleOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces/modeling'

import { EntitiesContext } from '../model-context'
import styles from '../model-pannel.module.scss'
interface Props {
  entity: Entity
}

export default function ModelEntityItem({ entity }: Props) {
  const { entities, setEntities } = useContext(EntitiesContext)
  const [isEditing, setIsEditing] = useImmer(false)
  const [isShowOperate, setIsShowOperate] = useImmer(false)
  const [visible, setVisible] = useImmer(false)

  //删除确认框确认/取消按钮回调
  const text = '确认删除该实体吗？'
  const confirm = () => {
    handleItemDelete(entity)
  }
  const cancel = () => {
    setVisible(false)
  }

  //数据增删更新操作回调
  function handleItemEdit(text: string) {
    updateEntity({ id: entity.id, name: text })
    setIsEditing(false)
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

  //设置下拉菜单显示和隐藏效果
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag)
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
          label: (
            <Popconfirm
              placement="right"
              title={text}
              onConfirm={confirm}
              okText="删除"
              cancelText="取消"
              onCancel={cancel}
              overlayClassName={styles['delete-label']}
              okType={'danger'}
            >
              <span>删除</span>,
            </Popconfirm>
          ),
        },
      ]}
    />
  )

  return (
    <div
      className="flex justify-start items-center py-10px"
      style={{ backgroundColor: isShowOperate ? 'Lightgray' : '' }}
      key={entity.name}
      onMouseEnter={() => {
        setIsShowOperate(true)
      }}
      onMouseLeave={() => {
        setIsShowOperate(false)
        setVisible(false)
      }}
    >
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

      <Dropdown
        overlay={menu}
        onVisibleChange={handleVisibleChange}
        visible={visible}
        trigger={['click']}
        placement="bottomRight"
      >
        <MoreOutlined
          className="m-auto mr-0 pr-2"
          style={{ visibility: isShowOperate ? 'visible' : 'hidden' }}
        ></MoreOutlined>
      </Dropdown>
    </div>
  )
}
