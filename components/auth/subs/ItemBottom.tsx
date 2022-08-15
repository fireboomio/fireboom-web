import { MoreOutlined, GithubOutlined, BarsOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import type { MenuProps } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { AuthProvResp } from '@/interfaces/auth'
import { AuthDispatchContext, AuthCurrContext, AuthToggleContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from '../Common.module.scss'

interface Props {
  authItem: AuthProvResp
  onClickItem: (authItem: AuthProvResp) => void
}

interface Config {
  [key: string]: string
}

export default function AuthItem({ authItem, onClickItem }: Props) {
  const [isEditing, setIsEditing] = useImmer(authItem.name == '')
  const [visible, setVisible] = useImmer(false)
  const dispatch = useContext(AuthDispatchContext)
  const { currAuthProvItemId } = useContext(AuthCurrContext)
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const [isHovering, setIsHovering] = useImmer(false)
  const config = JSON.parse(authItem.config) as Config

  const handleMenuClick: MenuProps['onClick'] = e => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2') {
      setVisible(false)
    }
  }

  async function handleItemEdit(value: string) {
    if (value === '') {
      dispatch({ type: 'deleted', data: authItem })
    } else {
      await requests.put('/auth', {
        ...authItem,
        name: value,
        config: JSON.stringify({ ...config, id: value }),
      })
      void requests.get<unknown, AuthProvResp[]>('/auth').then(res => {
        dispatch({
          type: 'fetched',
          data: res,
        })
      })
    }
    setIsEditing(false)
  }

  async function handleItemDelete(item: AuthProvResp) {
    void (await requests.delete(`/auth/${item.id}`))
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
                handleBottomToggleDesigner('edit', authItem.id)
              }}
            >
              <IconFont type="icon-bianji" />
              <span className="ml-1.5">配置</span>
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <Popconfirm
              placement="right"
              title="确认删除该文件吗？"
              onConfirm={() => void handleItemDelete(authItem)}
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
      className={`flex justify-between items-center py-2.5 pl-4 "
      ${authItem.id === currAuthProvItemId ? 'bg-[#F8F8F9]' : ''}`}
      style={isHovering ? { background: '#F8F8F9' } : {}}
      key={authItem.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onDoubleClick={() => setIsEditing(true)}
      onClick={() => {
        onClickItem(authItem)
      }}
    >
      <div className="flex items-center cursor-pointer">
        <BarsOutlined
          className="-ml-4 mr-2"
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        />
        <GithubOutlined className="mr-2" />
        {isEditing ? (
          <Input
            onBlur={e => void handleItemEdit(e.target.value)}
            // @ts-ignore
            onPressEnter={e => void handleItemEdit(e.target.value)}
            onKeyUp={(e: React.KeyboardEvent) => {
              e.key == 'Escape' && setIsEditing(false)
            }}
            className="text-sm font-normal leading-4 h-5 w-5/7 pl-0.5"
            defaultValue={authItem.name}
            autoFocus
            placeholder="请输入供应商ID"
          />
        ) : (
          <div
            onClick={() => {
              // setIsEditing(true)
            }}
            className="text-sm font-normal leading-4"
          >
            {authItem.name}
          </div>
        )}
      </div>
      <div>
        <span className="text-[#AFB0B4] text-[14px] mr-3">{authItem.authSupplier || 'null'}</span>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomRight"
          visible={visible}
          onVisibleChange={v => {
            setVisible(v)
            leaveItem(v)
          }}
        >
          <MoreOutlined
            onClick={e => e.stopPropagation()}
            className="m-auto mr-0 pr-2"
            style={{ visibility: isHovering ? 'visible' : 'hidden' }}
          />
        </Dropdown>
      </div>
    </div>
  )
}
