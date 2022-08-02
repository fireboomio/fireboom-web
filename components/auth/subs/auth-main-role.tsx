/* eslint-disable react-hooks/exhaustive-deps */
import {
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { Button, Table, Modal, Form, Input, Tabs, Switch } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './auth-common-main.module.scss'

interface RoleProvResp {
  id: number
  code: string
  remark: string
  create_time: string | number
}
// 身份验证
interface Authentication {
  content: string
  fileName: string
  hookName: string
  hookSwitch: boolean
}

const { TabPane } = Tabs

export default function AuthMainRole() {
  const [form] = Form.useForm()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer([] as Array<RoleProvResp>)
  const [postAuth, setPostAuth] = useImmer({} as Authentication)
  const [mutatingPostAuth, setMutatingPostAuth] = useImmer({} as Authentication)

  const getData = useCallback(async () => {
    const authentication = await requests.get<unknown, Array<RoleProvResp>>('/role')
    setRoleData(authentication)
    console.log(authentication, 'authentication')
  }, [])

  const getStatus = useCallback(async () => {
    const data = await requests.get<unknown, Array<Authentication>>('/auth/hooks')
    console.log(data, 'data')
    setPostAuth(data[0])
    setMutatingPostAuth(data[1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void getData()
    void getStatus()
  }, [])

  const putPostAuth = async () => {
    const res = await requests.put('/auth/hooks', {
      content: postAuth.content,
      hookName: postAuth.hookName,
      hookSwitch: postAuth.hookSwitch,
    })
    void getStatus()
    console.log(res)
  }

  const putMutatingPostAuth = async () => {
    const res = await requests.put('/auth/hooks', {
      content: mutatingPostAuth.content,
      hookName: mutatingPostAuth.hookName,
      hookSwitch: mutatingPostAuth.hookSwitch,
    })
    void getStatus()
    console.log(res)
  }

  const onFinish = async (values: RoleProvResp) => {
    console.log('Success:', values)
    await requests.post('/role', values)
    await getData()
  }
  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const handleDeleteRole = async (id: number) => {
    await requests.delete(`/role/${id}`)
    await getData()
  }
  const columns: ColumnsType<RoleProvResp> = [
    {
      title: '角色',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '角色描述',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '操作',
      key: 4,
      render: (_, { id }) => (
        <Button
          type="text"
          className="pl-0 text-red-500"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            void handleDeleteRole(id)
          }}
        >
          删除
        </Button>
      ),
    },
  ]

  const onChangeMange = (key: string) => {
    if (key == '2') {
      void getStatus()
    } else {
      void getData()
    }

    console.log(key, 'onchangeMange')
  }

  const onChangeIdentity = (key: string) => {
    if (key == '2') {
      void putMutatingPostAuth()
    } else {
      void putPostAuth()
    }
    console.log(key, 'onchangeIdentity')
  }

  return (
    <>
      <Tabs defaultActiveKey="1" onChange={onChangeMange}>
        <TabPane tab="角色管理" key="1">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base text-gray">角色管理</span>
            <Button
              className="px-4 py-0 h-7.5"
              onClick={() => {
                setModal1Visible(true)
              }}
            >
              <span className="text-sm text-gray">添加</span>
            </Button>
          </div>
          <Modal
            mask={false}
            title="添加"
            style={{ top: '200px' }}
            width={549}
            transitionName=""
            visible={modal1Visible}
            onOk={() => setModal1Visible(false)}
            onCancel={() => setModal1Visible(false)}
            okText={
              <Button
                className={styles['save-btn']}
                onClick={() => {
                  form.submit()
                }}
              >
                <span>保存</span>
              </Button>
            }
            okType="text"
            cancelText="取消"
          >
            <Form
              name="roleList"
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              onFinish={(values) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                void onFinish(values)
              }}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              labelAlign="left"
              className="h-30 mt-8 ml-8"
            >
              <Form.Item
                label="角色code"
                name="code"
                rules={[{ required: true, message: 'Please input your roleCode!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="角色描述" name="remark">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
          <div className={styles['role-container-table']}>
            {roleData.length > 0 ? (
              <Table
                columns={columns}
                dataSource={roleData}
                rowKey={(record) => record.id}
                rowClassName={(record, index) => (index % 2 === 1 ? styles['role-table'] : '')}
                pagination={false}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={[]}
                rowKey={(record) => record.id}
                rowClassName={(record, index) => (index % 2 === 1 ? styles['role-table'] : '')}
                pagination={false}
              />
            )}
          </div>
        </TabPane>
        <TabPane tab="身份鉴权" key="2">
          <Tabs defaultActiveKey="1" onChange={onChangeIdentity}>
            <TabPane tab={postAuth.hookName} key="1">
              <div className="flex justify-between items-center">
                <div className={styles['auth-head']}>
                  <InfoCircleOutlined />
                  <span>根据各种提供器选择逻辑，获取当前用户的角色</span>
                </div>
                <div className={`${styles['auth-btn']} flex items-center mr-2`}>
                  <Button type="text" icon={<PlayCircleOutlined />}>
                    测试
                  </Button>
                  <Button type="text" icon={<PlusCircleOutlined />}>
                    添加
                  </Button>
                  <Button type="text" icon={<UnorderedListOutlined />}>
                    管理
                  </Button>
                  <Button type="text" icon={<PlayCircleOutlined />}>
                    选择
                  </Button>
                  <Switch
                    checked={postAuth.hookSwitch}
                    className={styles['switch-edit-btn']}
                    size="small"
                    onChange={() => {
                      void putPostAuth()
                    }}
                  />
                </div>
              </div>
              <Editor
                height="60vh"
                defaultLanguage="typescript"
                defaultValue="// some comment"
                value={postAuth.content}
                className={`mt-4 ${styles.monaco}`}
              />
            </TabPane>
            <TabPane tab={mutatingPostAuth.hookName} key="2">
              <div className="flex justify-between items-center">
                <div className={styles['auth-head']}>
                  <InfoCircleOutlined />
                  <span>根据各种提供器选择逻辑，获取当前用户的角色</span>
                </div>
                <div className={`${styles['auth-btn']} flex items-center mr-2`}>
                  <Button type="text" icon={<PlayCircleOutlined />}>
                    测试
                  </Button>
                  <Button type="text" icon={<PlusCircleOutlined />}>
                    添加
                  </Button>
                  <Button type="text" icon={<UnorderedListOutlined />}>
                    管理
                  </Button>
                  <Button type="text" icon={<PlayCircleOutlined />}>
                    选择
                  </Button>
                  <Switch
                    checked={mutatingPostAuth.hookSwitch}
                    className={styles['switch-edit-btn']}
                    size="small"
                    onChange={() => {
                      void putMutatingPostAuth()
                    }}
                  />
                </div>
              </div>
              <Editor
                height="60vh"
                defaultLanguage="typescript"
                defaultValue="// some comment"
                value={mutatingPostAuth.content}
                className={`mt-4 ${styles.monaco}`}
              />
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </>
  )
}
