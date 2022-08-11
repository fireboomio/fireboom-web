import { CaretRightOutlined, LockOutlined, PoweroffOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Image } from 'antd'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp, AuthListType } from '@/interfaces/auth'

import IconFont from '../iconfont'
import styles from './Pannel.module.scss'
import AuthMainCheck from './subs/Check'
import AuthMainEdit from './subs/Edit'
// import AuthMainIdentity from './subs/auth-main-identity'
import AuthMainRole from './subs/Role'
import AuthMainUser from './subs/User'
import AuthMainUserDetails from './subs/UserDetails'
import AuthWebhooks from './subs/Webhooks'

interface Props {
  content: AuthProvResp
  showTopType: string
  showBottomType: string
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const listMenu = (
  <Menu
    items={[
      {
        key: '0',
        label: (
          <div>
            <LockOutlined className="mr-2" />
            <span>锁定</span>
          </div>
        ),
      },
      {
        key: '1',
        label: (
          <div>
            <IconFont type="icon-shanchu" className="mr-2" />
            <span>删除</span>
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div>
            <PoweroffOutlined className="mr-2" />
            <span>强制下线</span>
          </div>
        ),
      },
    ]}
  />
)

export default function AuthContainer({
  content,
  showTopType,
  showBottomType,
  handleTopToggleDesigner,
}: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')
  const [title, setTitle] = useImmer<React.ReactNode>('')
  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    switch (showTopType) {
      case 'outline':
        setTitle('概览')
        setViewer(<div>概览</div>)
        break
      case 'userManage':
        setTitle('用户管理')
        setViewer(<AuthMainUser handleTopToggleDesigner={handleTopToggleDesigner} />)
        break
      case 'userDetails':
        setTitle('用户详情')
        setViewer(<AuthMainUserDetails />)
        break
      case 'roleManage':
        setTitle('角色管理')
        setViewer(<AuthMainRole />)
        break
      case 'action':
        setTitle('操作日志')
        setViewer(<div>操作日志</div>)
        break
      case 'login':
        setTitle('登入体验')
        setViewer(<div>登入体验</div>)
        break
      case 'connect':
        setTitle('连接器')
        setViewer(<div>连接器</div>)
        break
      case 'webhooks':
        setTitle('webhooks')
        setViewer(<AuthWebhooks />)
        break
      default:
        setViewer(<div>error</div>)
        break
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTopType])

  useEffect(() => {
    if (content) {
      switch (showBottomType) {
        case 'data':
          setTitle('身份验证')
          setViewer(<AuthMainCheck content={content} />)
          break
        case 'edit':
          setTitle('身份验证')
          setViewer(<AuthMainEdit content={content} />)
          break
        default:
          setViewer(JSON.stringify(content))
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBottomType, content])
  return (
    <div className="pl-6 pr-10 mt-6">
      {showTopType !== 'userDetails' ? (
        <div className="flex justify-start items-center mb-5 ">
          <span className="text-lg flex-grow font-bold">
            身份验证
            <span className="text-base flex-grow font-bold">
              {' '}
              <CaretRightOutlined /> {title}
            </span>
          </span>
          <IconFont type="icon-lianxi" className="text-[22px]" onClick={handleIconClick} />
          <IconFont type="icon-wenjian1" className="text-[22px] ml-4" onClick={handleIconClick} />
          <IconFont type="icon-bangzhu" className="text-[22px] ml-4" onClick={handleIconClick} />
        </div>
      ) : (
        <div className="flex justify-between">
          <div className="flex">
            <Image src="/assets/auth.svg" alt="头像" width={50} height={50} preview={false} />
            <div className="ml-8">
              <span>anson</span>
              <p>ID：6291fe05cbgedyuyu</p>
            </div>
          </div>
          <div>
            <Dropdown overlay={listMenu} placement="bottom">
              <Button className="mr-2">更多</Button>
            </Dropdown>
            <Button className={`${styles['save-btn']} ml-4`}>重置密码</Button>
          </div>
        </div>
      )}
      {viewer}
    </div>
  )
}
