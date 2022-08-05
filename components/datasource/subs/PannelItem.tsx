import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import type { MenuProps } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
  DatasourceToggleContext,
} from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './PannelItem.module.scss'

interface Props {
  datasourceItem: DatasourceResp
  onClickItem: (dsItem: DatasourceResp) => void
}

interface Config {
  [key: string]: string
}

export default function DatasourceItem({ datasourceItem, onClickItem }: Props) {
  const dispatch = useContext(DatasourceDispatchContext)
  const [isEditing, setIsEditing] = useImmer(datasourceItem.name == '')
  const [visible, setVisible] = useImmer(false)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const { currDBId } = useContext(DatasourceCurrDBContext)
  const [isHovering, setIsHovering] = useImmer(false)
  const config = datasourceItem.config as Config

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2') {
      setVisible(false)
    }
  }

  //重命名input框onblur或enter回调
  async function handleItemEdit(value: string) {
    console.log(datasourceItem)
    if (value === '') {
      dispatch({ type: 'deleted', data: datasourceItem })
    } else {
      await requests.put('/dataSource', {
        ...datasourceItem,
        name: value,
        config: JSON.stringify({ ...config, apiNameSpace: value }),
      })
      void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
        dispatch({
          type: 'fetched',
          data: res,
        })
      })
    }
    setIsEditing(false)
  }

  async function handleItemDelete(item: DatasourceResp) {
    void (await requests.delete(`/dataSource/${item.id}`))
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
              <IconFont type="icon-zhongmingming" />
              <span className="ml-1.5">重命名</span>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div
              onClick={() => {
                handleToggleDesigner('edit', datasourceItem.id)
              }}
            >
              <IconFont type="icon-bianji" />
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
                <IconFont type="icon-a-shanchu2" />
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
      className={`flex justify-between items-center py-2.5 pl-5
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
      <div className="flex items-center cursor-pointer">
        <IconFont
          type="icon-tuozhuai-xuanzhong"
          className="-ml-3 mr-1"
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        />
        {datasourceItem.sourceType == 1 ? (
          <IconFont
            type={
              config.dbType == 'SQLITE'
                ? 'icon-shujuyuantubiao2'
                : config.dbType == 'PGSQL'
                ? 'icon-shujuyuantubiao3'
                : config.dbType == 'MONGODB'
                ? 'icon-shujuyuantubiao4'
                : 'icon-shujuyuantubiao1'
            }
          />
        ) : datasourceItem.sourceType == 2 ? (
          <IconFont type="icon-wenjian1" className="text-[16px]" />
        ) : datasourceItem.sourceType == 3 ? (
          <IconFont type="icon-QLweixuanzhong1" className="text-[16px]" />
        ) : (
          <IconFont type="icon-wenjian" className="text-[16px]" />
        )}

        {isEditing ? (
          <Input
            onBlur={(e) => void handleItemEdit(e.target.value)}
            // @ts-ignore
            onPressEnter={(e) => void handleItemEdit(e.target.value)}
            onKeyUp={(e: React.KeyboardEvent) => {
              e.key == 'Escape' && setIsEditing(false)
            }}
            className="text-sm font-normal leading-4 h-5 w-5/7"
            defaultValue={datasourceItem.name}
            autoFocus
            placeholder="请输入外部数据源名"
          />
        ) : (
          <div
            className={`text-sm font-normal ml-2 leading-4 ${
              datasourceItem.switch == 0 ? 'text-[#000000]' : 'text-[#AFB0B4]'
            } ${datasourceItem.id === currDBId ? 'font-650' : ''}`}
          >
            {datasourceItem.name}
          </div>
        )}
      </div>
      <div>
        <span className="text-[#AFB0B4] text-[14px] mr-3">
          {config.dbName ||
            (config.databaseUrl as unknown as { kind: string; val: string })?.val.substring(
              (config.databaseUrl as unknown as { kind: string; val: string })?.val.length - 3
            )}
        </span>
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
          <IconFont
            type="icon-gengduo-shu-xuanzhong"
            onClick={(e) => e.stopPropagation()}
            className="m-auto mr-0 pr-2"
            style={{ visibility: isHovering ? 'visible' : 'hidden' }}
          />
        </Dropdown>
      </div>
    </div>
  )
}
