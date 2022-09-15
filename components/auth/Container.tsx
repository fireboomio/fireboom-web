import { CaretRightOutlined, LockOutlined, PoweroffOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Image } from 'antd'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp, AuthListType } from '@/interfaces/auth'

import IconFont from '../iconfont'
import styles from './Common.module.scss'
import Connector from './connector'
import ConnectorDetails from './connectorDetails'
import Experience from './experience'
import AuthCheck from './subs/Check'
import AuthDB from './subs/DB'
import AuthEdit from './subs/Edit'
import AuthRole from './subs/Role'
import AuthUser from './subs/User'
import AuthUserDetails from './subs/UserDetails'
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
          <>
            <LockOutlined className="mr-2" />
            <span>锁定账号</span>
          </>
        ),
      },
      {
        key: '1',
        label: (
          <>
            <IconFont type="icon-shanchu" className="mr-2" />
            <span>删除账号</span>
          </>
        ),
      },
      {
        key: '2',
        label: (
          <>
            <PoweroffOutlined className="mr-2" />
            <span>强制下线</span>
          </>
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
    console.log('handleIconClick')
  }

  useEffect(() => {
    switch (showTopType) {
      case 'outline':
        setTitle('概览')
        setViewer(<div>概览</div>)
        break
      case 'userManage':
        setTitle('用户管理')
        setViewer(<AuthUser handleTopToggleDesigner={handleTopToggleDesigner} />)
        break
      case 'userDetails':
        setTitle('用户详情')
        setViewer(<AuthUserDetails />)
        break
      case 'roleManage':
        setTitle('角色管理')
        setViewer(<AuthRole />)
        break
      case 'log':
        setTitle('操作日志')
        setViewer(<div>操作日志</div>)
        break
      case 'login':
        setTitle('登入体验')
        setViewer(<Experience handleTopToggleDesigner={handleTopToggleDesigner} />)
        break
      case 'connect':
        setTitle('连接器')
        setViewer(<Connector handleTopToggleDesigner={handleTopToggleDesigner} />)
        break
      case 'connectDetails':
        setTitle('连接器详情')
        setViewer(<ConnectorDetails handleTopToggleDesigner={handleTopToggleDesigner} />)
        break
      case 'webhooks':
        setTitle('webhooks')
        setViewer(<AuthWebhooks />)
        break
      case 'db':
        setTitle('数据库')
        setViewer(<AuthDB />)
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
          setViewer(<AuthCheck content={content} />)
          break
        case 'edit':
          setTitle('身份验证')
          setViewer(<AuthEdit content={content} />)
          break
        default:
          setViewer(<></>)
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBottomType, content])

  return (
    <div className="pl-6 pr-6 mt-6">
      {showTopType !== 'userDetails' ? (
        <div className="flex justify-start items-center mb-5 ">
          <span className="text-lg flex-grow font-bold">
            身份验证
            <span className="text-base flex-grow font-bold">
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
            <Image src="/assets/auth.svg" alt="头像" width={45} height={45} preview={false} />
            <div className={styles['user-info']}>
              <span>anson</span>
              <p>ID：6291fe05cbgedyuyu</p>
            </div>
          </div>
          <div>
            <Dropdown overlay={listMenu} placement="bottom">
              <Button className={`${styles['connect-check-btn-common']} w-15 ml-4`}>
                <span className="text-sm text-gray">更多</span>
              </Button>
            </Dropdown>
            <Button className={`${styles['save-btn']} ml-4`}>重置密码</Button>
          </div>
        </div>
      )}
      {viewer}
    </div>
  )
}
