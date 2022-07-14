import { AppleOutlined, MoreOutlined, GithubOutlined, BarsOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import type { MenuProps } from 'antd'
import axios from 'axios'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthDispatchContext, AuthCurrContext, AuthToggleContext } from '@/lib/context'

import styles from '../auth-pannel.module.scss'

interface Props {
  authProvItem: AuthProvResp
  onClickItem: (fsItem: AuthProvResp) => void
}

export default function AuthProvItem({ authProvItem, onClickItem }: Props) {
  const dispatch = useContext(AuthDispatchContext)
  const [isEditing, setIsEditing] = useImmer(authProvItem.name == '')
  const [visible, setVisible] = useImmer(false)
  const { currAuthProvItemId } = useContext(AuthCurrContext)
  const { handleToggleDesigner } = useContext(AuthToggleContext)
  const [isHovering, setIsHovering] = useImmer(authProvItem.id === currAuthProvItemId)
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2' || e.key === '3') {
      setVisible(false)
    }
  }

  async function handleItemEdit(value: string) {
    if (value === '') {
      dispatch({ type: 'deleted', data: authProvItem })
    } else {
      if (authProvItem.id !== 0) {
        await axios.put('/api/v1/auth', { ...authProvItem, name: value })
        dispatch({ type: 'changed', data: { ...authProvItem, name: value } })
      } else {
        const req = { ...authProvItem, name: value }
        Reflect.deleteProperty(req, 'id')
        await axios.post('/api/v1/auth', req)
        dispatch({ type: 'changed', data: { ...authProvItem, name: value } })
      }
    }
    setIsEditing(false)
  }

  async function handleItemDelete(item: AuthProvResp) {
    const result = await axios.delete(`/api/v1/auth/${item.id}`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result.data.code == 200) {
      dispatch({ type: 'deleted', data: item })
    }
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
                handleToggleDesigner('edit', authProvItem.id)
              }}
            >
              <AppleOutlined />
              <span className="ml-1.5">配置</span>
            </div>
          ),
        },
        {
          key: '4',
          label: (
            <Popconfirm
              placement="right"
              title="确认删除该文件吗？"
              onConfirm={() => void handleItemDelete(authProvItem)}
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
      className={`flex justify-start items-center py-2.5 pl-4 cursor-pointer"
      ${authProvItem.id === currAuthProvItemId ? 'bg-[#F8F8F9]' : ''}`}
      style={isHovering ? { background: '#F8F8F9' } : {}}
      key={authProvItem.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onClick={() => {
        onClickItem(authProvItem)
      }}
    >
      <BarsOutlined
        className="-ml-4 mr-2"
        style={{ visibility: isHovering ? 'visible' : 'hidden' }}
      />
      <GithubOutlined className="mr-2" />
      {isEditing ? (
        <Input
          onBlur={(e) => void handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => void handleItemEdit(e.target.value)}
          onKeyUp={(e: React.KeyboardEvent) => {
            e.key == 'Escape' && setIsEditing(false)
          }}
          className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
          defaultValue={authProvItem.name}
          autoFocus
          placeholder="请输入外部数据源名"
        />
      ) : (
        <div
          onClick={() => {
            // setIsEditing(true)
          }}
        >
          <span className="text-sm font-normal leading-4"> {authProvItem.name}</span>
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
