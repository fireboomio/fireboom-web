import { AppleOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import type { MenuProps } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
  DatasourceToggleContext,
} from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from '../datasource-pannel.module.scss'

interface Props {
  datasourceItem: DatasourceResp
  onClickItem: (dsItem: DatasourceResp) => void
  Datasourcetype: number
}

export default function DatasourceDBItem({ datasourceItem, onClickItem, Datasourcetype }: Props) {
  const dispatch = useContext(DatasourceDispatchContext)
  const [isEditing, setIsEditing] = useImmer(datasourceItem.name == '')
  const [visible, setVisible] = useImmer(false)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const { currDBId } = useContext(DatasourceCurrDBContext)
  const [isHovering, setIsHovering] = useImmer(false)
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2') {
      setVisible(false)
    }
  }

  async function handleItemEdit(value: string) {
    if (value === '') {
      dispatch({ type: 'deleted', data: datasourceItem })
    } else {
      if (datasourceItem.id != 0) {
        await requests.put('/dataSource', { ...datasourceItem, name: value })
        dispatch({
          type: 'fetched',
          sourceType: Datasourcetype,
        })
      } else {
        const req = { ...datasourceItem, name: value }
        Reflect.deleteProperty(req, 'id')
        await requests.post('/dataSource', req)
        dispatch({
          type: 'fetched',
          sourceType: Datasourcetype,
        })
      }
    }
    setIsEditing(false)
  }

  async function handleItemDelete(item: DatasourceResp) {
    const result = await requests.delete(`/dataSource/${item.id}`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    dispatch({ type: 'deleted', data: item })
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
            <div
              onClick={() => {
                setIsEditing(!isEditing)
              }}
            >
              <AppleOutlined />
              <span className="ml-1.5">重命名</span>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div
              onClick={() => {
                let type = 'DB'
                switch (datasourceItem.source_type) {
                  case 1:
                    type = 'DB'
                    break
                  case 2:
                    type = 'REST'
                    break
                  case 3:
                    type = 'Graphal'
                    break
                  case 4:
                    type = 'defineByself'
                    break
                  default:
                    break
                }
                handleToggleDesigner(type, datasourceItem.id)
              }}
            >
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
              onConfirm={() => void handleItemDelete(datasourceItem)}
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
      className={`flex justify-start items-center py-2.5 pl-3 cursor-pointer"
      ${datasourceItem.id === currDBId ? 'bg-[#F8F8F9]' : ''}`}
      style={isHovering ? { background: '#F8F8F9' } : {}}
      key={datasourceItem.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onDoubleClick={() => setIsEditing(true)}
      onClick={() => {
        onClickItem(datasourceItem)
      }}
    >
      <AppleOutlined className="ml-2px mr-2" />

      {isEditing ? (
        <Input
          onBlur={(e) => void handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => void handleItemEdit(e.target.value)}
          onKeyUp={(e: React.KeyboardEvent) => {
            e.key == 'Escape' && setIsEditing(false)
          }}
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
          onClick={(e) => e.stopPropagation()}
          className="m-auto mr-0 pr-2"
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        />
      </Dropdown>
    </div>
  )
}
