import { CaretRightOutlined, LockOutlined, PoweroffOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Image, Modal, Form, Input } from 'antd'
import React, { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp, AuthListType } from '@/interfaces/auth'
import { AuthUserCurrContext } from '@/lib/context/auth-context'
import requests from '@/lib/fetchers'

import Error404 from '../ErrorPage/404'
import ErrorWorking from '../ErrorPage/Working'
import IconFont from '../iconfont'
import styles from './Common.module.scss'
import Connector from './connector'
import ConnectorDetails from './connectorDetails'
import Experience from './experience'
import AuthCheck from './subs/Check'
import AuthDB from './subs/DB'
import AuthEdit from './subs/Edit'
import AuthOutLine from './subs/OutLine'
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
  const { authUserCurr } = useContext(AuthUserCurrContext)
  const [visible, setVisible] = useImmer(false)

  const [form] = Form.useForm()

  const handleIconClick = () => {
    console.log('handleIconClick')
  }

  useEffect(() => {
    switch (showTopType) {
      case 'outline':
        setTitle('概览')
        setViewer(<AuthOutLine />)
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
        setViewer(<ErrorWorking />)
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
        setViewer(<Error404 />)
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

  function resetPasswd() {
    setVisible(true)
  }

  const handleOk = () => {
    form.submit()
    setVisible(false)
  }

  const onFinish = (values: Record<string, string>) => {
    void requests.put('/oauth/password', { id: authUserCurr.id, password: values.password })
  }

  return (
    <>
      <div className={'pl-6 pr-6 pt-6' + (showTopType === 'outline' ? ' bg-[#FDFDFDFF]' : '')}>
        {showTopType !== 'userDetails' ? (
          <div className="flex justify-start items-center mb-2.5 ">
            {showTopType === 'outline' ? (
              <div className="flex-grow">
                <div className="font-bold text-lg leading-6">概览</div>
                <div className="mt1.5 text-xs " style={{ color: 'rgba(175,176,180,0.6)' }}>
                  查看所以应用的数据情况
                </div>
              </div>
            ) : (
              <span className="text-lg flex-grow font-bold">
                身份验证
                <span className="text-base flex-grow font-bold">
                  <CaretRightOutlined /> {title}
                </span>
              </span>
            )}
            <IconFont type="icon-lianxi" className="text-[22px]" onClick={handleIconClick} />
            <IconFont type="icon-wenjian1" className="text-[22px] ml-4" onClick={handleIconClick} />
            <IconFont type="icon-bangzhu" className="text-[22px] ml-4" onClick={handleIconClick} />
          </div>
        ) : (
          <div className="flex justify-between items-center mt-9 mb-5">
            <div className="flex items-center">
              <Image src="/assets/auth.svg" alt="头像" width={45} height={45} preview={false} />
              <div className={`ml-2 ${styles['user-info']}`}>
                <span>{authUserCurr.name}</span>
                <p>ID：{authUserCurr.id}</p>
              </div>
            </div>
            <div>
              <Dropdown overlay={listMenu} placement="bottom">
                <Button className={`${styles['connect-check-btn-common']} w-15 ml-4`}>
                  <span className="text-sm text-gray">更多</span>
                </Button>
              </Dropdown>
              <Button className={`${styles['save-btn']} ml-4`} onClick={resetPasswd}>
                重置密码
              </Button>
            </div>
          </div>
        )}
        {viewer}
      </div>

      <Modal
        title="重置密码"
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        cancelText="取消"
        okText="确认"
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password size="small" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
