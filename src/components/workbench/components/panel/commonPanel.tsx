import { Dropdown, Input, Menu, Popconfirm, Image } from 'antd'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import IconFont from '@/components/iconfont'
import SidePanel from '@/components/workbench/components/panel/sidePanel'
import { CommonPanelAction, CommonPanelResp } from '@/interfaces/commonpanel'
import { DatasourceResp } from '@/interfaces/datasource'
import { StorageResp } from '@/interfaces/storage'
import requests from '@/lib/fetchers'
import commonPanelReducer from '@/lib/reducers/panel-reducer'

import styles from './commonPanel.module.scss'

interface PanelConfig {
  title: string
  openItem: (id: number) => string
  newItem: string
  request: {
    getList: (dispatch: React.Dispatch<CommonPanelAction>) => void
    editItem: (row: unknown) => Promise<unknown>
    delItem: (id: number) => Promise<unknown>
  }
  navMenu?: Array<{
    icon: string
    name: string
    menuPath: (id: number) => string
  }>
}

const panelMap: { [key: string]: PanelConfig } = {
  dataSource: {
    title: '数据源',
    openItem: id => `/dataSource/${id}`,
    newItem: '/dataSource/new',
    request: {
      getList: dispatch => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
          dispatch({
            type: 'fetched',
            data: res.map(row => {
              let icon = 'other'
              let tip = ''
              switch (row.sourceType) {
                case 1:
                  icon = { MySQL: 'mysql', PostgreSQL: 'pgsql' }[String(row.config.dbType)] || icon
                  tip = String(row.config.dbName || '')
                  break
                case 2:
                  icon = 'rest'
                  break
                case 3:
                  icon = 'graphql'
                  break
              }
              return { id: row.id, name: row.name, icon, tip, switch: row.switch, _row: row }
            }),
          })
        })
      },
      editItem: async row => await requests.put('/dataSource', row),
      delItem: async id => await requests.delete(`/dataSource/${id}`),
    },
  },
  storage: {
    title: '文件存储',
    openItem: id => `/storage/${id}`,
    newItem: '/storage/new',
    request: {
      getList: dispatch => {
        void requests.get<unknown, StorageResp[]>('/storageBucket').then(res => {
          dispatch({
            type: 'fetched',
            data: res.map(row => {
              const icon = 'other'
              const tip = ''
              return { id: row.id, name: row.name, icon, tip, switch: row.switch, _row: row }
            }),
          })
        })
      },
      editItem: async row => await requests.put('/storageBucket', row),
      delItem: async id => await requests.delete(`/storageBucket/${id}`),
    },
    navMenu: [
      {
        icon: 'icon-wenjian1',
        name: '查看',
        menuPath: id => `/storage/${id}`,
      },
    ],
  },
  auth: {
    title: '身份验证',
    openItem: id => `/auth/${id}`,
    newItem: '/auth/new',
    request: {
      getList: dispatch => {
        void requests.get<unknown, StorageResp[]>('/auth').then(res => {
          dispatch({
            type: 'fetched',
            data: res.map(row => {
              const icon = 'other'
              const tip = ''
              return { id: row.id, name: row.name, icon, tip, switch: row.switch, _row: row }
            }),
          })
        })
      },
      editItem: async row => await requests.put('/auth', row),
      delItem: async id => await requests.delete(`/auth/${id}`),
    },
  },
}

export default function CommonPanel(props: { type: string }) {
  const panelConfig = useMemo<PanelConfig>(() => panelMap[props.type], [props.type])
  const navigate = useNavigate()
  const location = useLocation()
  const [editTarget, setEditTarget] = useState<CommonPanelResp>() // 当前正在重命名的对象
  const [dropDownId, setDropDownId] = useState<number>() // 当前下拉列表的对象id
  const [datasource, dispatch] = useReducer(commonPanelReducer, [])

  // 监听路由变化，从而标记当前页面
  // useEffect(() => {
  //   console.log(location)
  // }, [location])
  // 初始化列表
  useEffect(() => {
    panelConfig.request.getList(dispatch)
  }, [props.type])

  const dropDownMenu = (row: CommonPanelResp) => {
    const menuItems: Array<{ key: string; label: React.ReactNode }> = [
      {
        key: 'rename',
        label: (
          <div onClick={() => setEditTarget(row)}>
            <IconFont type="icon-zhongmingming" />
            <span className="ml-1.5">重命名</span>
          </div>
        ),
      },
      {
        key: 'delete',
        label: (
          <Popconfirm
            placement="right"
            title="确认删除该实体吗？"
            onConfirm={() => void handleItemDelete(dropDownId)}
            okText="删除"
            cancelText="取消"
            overlayClassName={styles['delete-label']}
            okType={'danger'}
          >
            <div>
              <IconFont type="icon-a-shanchu2" />
              <span className="ml-1.5">删除</span>
            </div>
          </Popconfirm>
        ),
      },
    ]
    if (panelConfig.navMenu) {
      menuItems.unshift(
        ...panelConfig.navMenu.map(item => ({
          key: item.name,
          label: (
            <div onClick={() => navigate(item.menuPath(row.id))}>
              <IconFont type={item.icon} />
              <span className="ml-1.5">{item.name}</span>
            </div>
          ),
        }))
      )
    }
    return (
      <Menu
        onClick={e => {
          if (e.key !== 'delete') {
            setDropDownId(undefined)
          }
        }}
        items={menuItems}
      />
    )
  }

  const handleItemDelete = async (id?: number) => {
    if (!id) {
      return
    }
    await panelConfig.request.delItem(id)
    panelConfig.request.getList(dispatch)
    setDropDownId(undefined)
  }
  const handleItemEdit = async (value: string) => {
    const row = editTarget?._row
    if (row === undefined) {
      return
    }
    row.name = value
    await panelConfig.request.editItem(row)
    panelConfig.request.getList(dispatch)
    setEditTarget(undefined)
  }
  return (
    <SidePanel title={panelConfig.title} onAdd={() => navigate(panelConfig.newItem)}>
      <div className={styles.container}>
        {datasource.map(item => {
          const itemPath = panelConfig.openItem(item.id)
          return <div
            className={`${styles.row} ${item.switch ? styles.rowDisable : ''} ${itemPath === location.pathname ? styles.active : ''}`}
            key={item.id}
            onClick={() => navigate(itemPath)}
          >
            <div className={styles.icon}>
              <Image
                width={12}
                height={12}
                preview={false}
                alt={item.name}
                src={`/assets/workbench/panel-item-${item.icon}.png`}
              />
            </div>
            {editTarget?.id === item.id ? (
              <Input
                onBlur={() => setEditTarget(undefined)}
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onPressEnter={e => void handleItemEdit(e.target.value)}
                onKeyUp={(e: React.KeyboardEvent) => {
                  e.key == 'Escape' && setEditTarget(undefined)
                }}
                className="text-sm font-normal leading-4 h-5 w-5/7"
                defaultValue={editTarget.name}
                autoFocus
                placeholder="请输入外部数据源名"
              />
            ) : (
              <div className={styles.title}>{item.name}</div>
            )}
            <div className={styles.tip}>{item.tip}</div>
            <Dropdown
              overlay={dropDownMenu(item)}
              trigger={['click']}
              open={dropDownId === item.id}
              onOpenChange={flag => {
                setDropDownId(flag ? item.id : undefined)
                console.log(dropDownId)
              }}
              placement="bottomRight"
            >
              <div className={styles.more} onClick={e => e.preventDefault()} />
            </Dropdown>
          </div>
        })}
      </div>
    </SidePanel>
  )
}
