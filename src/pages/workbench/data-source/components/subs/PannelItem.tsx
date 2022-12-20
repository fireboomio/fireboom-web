import type { MenuProps } from 'antd'
import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/Iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceCurrDBContext,
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'

import styles from './PannelItem.module.less'

interface Props {
  datasourceItem: DatasourceResp
  onClickItem: (dsItem: DatasourceResp) => void
}

type Config = Record<string, string>

export default function PannelItem({ datasourceItem, onClickItem }: Props) {
  const dispatch = useContext(DatasourceDispatchContext)
  const [isEditing, setIsEditing] = useImmer(datasourceItem.name == '')
  const [visible, setVisible] = useImmer(false)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const { currDBId } = useContext(DatasourceCurrDBContext)
  const [isHovering, setIsHovering] = useImmer(false)
  const config = datasourceItem.config as Config

  const handleMenuClick: MenuProps['onClick'] = e => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2') {
      setVisible(false)
    }
  }

  //重命名input框onblur或enter回调
  async function handleItemEdit(value: string) {
    if (value === '') {
      dispatch({ type: 'deleted', data: datasourceItem })
    } else {
      await requests.put('/dataSource', {
        ...datasourceItem,
        name: value,
        config: { ...config, apiNameSpace: value }
      })
      void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
        dispatch({
          type: 'fetched',
          data: res
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
            <div onClick={() => setIsEditing(!isEditing)}>
              <img alt="zhongmingming" src="assets/iconfont/zhongmingming.svg" style={{height:'1em', width: '1em'}} />
              <span className="ml-1.5">重命名</span>
            </div>
          )
        },
        {
          key: '2',
          label: (
            <div onClick={() => handleToggleDesigner('form', datasourceItem.id)}>
              <img alt="bianji" src="assets/iconfont/bianji.svg" style={{height:'1em', width: '1em'}} />
              <span className="ml-1.5">编辑</span>
            </div>
          )
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
                <img alt="a-shanchu2" src="assets/iconfont/a-shanchu2.svg" style={{height:'1em', width: '1em'}} />
                <span className="ml-1.5">删除</span>
              </div>
            </Popconfirm>
          )
        }
      ]}
    />
  )
  return (
    <div
      className={`flex justify-between items-center py-2.5 pl-5 cursor-pointer
      ${datasourceItem.id === currDBId ? 'bg-[#F8F8F9]' : ''}`}
      style={isHovering ? { background: '#F8F8F9' } : {}}
      key={datasourceItem.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onDoubleClick={() => setIsEditing(true)}
      onClick={() => onClickItem(datasourceItem)}
    >
      <div className="flex items-center cursor-pointer">
        <img
          alt="tuozhuai-xuanzhong"
          src="assets/iconfont/tuozhuai-xuanzhong.svg"
          style={{ height: '1em', width: '1em', visibility: isHovering ? 'visible' : 'hidden' }}
          className="-ml-3 mr-1"
        />
        {datasourceItem.sourceType == 1 ? (
          <img
            alt="wenjian1"
            src="assets/iconfont/wenjian1.svg"
            style={{ height: '1em', width: '1em' }}
            className="text-[16px]"
          />
        ) : datasourceItem.sourceType == 3 ? (
          <img
            alt="QLweixuanzhong1"
            src="assets/iconfont/QLweixuanzhong1.svg"
            style={{ height: '1em', width: '1em' }}
            className="text-[16px]"
          />
        ) : (
          <img
            alt="wenjian"
            src="assets/iconfont/wenjian.svg"
            style={{ height: '1em', width: '1em' }}
            className="text-[16px]"
          />
        )}

        {isEditing ? (
          <Input
            onBlur={e => void handleItemEdit(e.target.value)}
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onPressEnter={e => void handleItemEdit(e.target.value)}
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
          open={visible}
          onOpenChange={v => {
            setVisible(v)
            leaveItem(v)
          }}
        >
          <img
            alt="gengduo-shu-xuanzhong"
            src="assets/iconfont/gengduo-shu-xuanzhong.svg"
            style={{ height: '1em', width: '1em', visibility: isHovering ? 'visible' : 'hidden' }}
            onClick={e => e.stopPropagation()}
            className="m-auto mr-0 pr-2"
          />
        </Dropdown>
      </div>
    </div>
  )
}
