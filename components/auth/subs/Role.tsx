/* eslint-disable react-hooks/exhaustive-deps */
import {
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { Button, Table, Modal, Form, Input, Tabs, Switch } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'

import RcTab from '@/components/rc-tab'
import { HookName, HookResp } from '@/interfaces/auth'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './subs.module.scss'

loader.config({ paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs' } })

interface RoleProvResp {
  id: number
  code: string
  remark: string
  create_time: string | number
}

interface TabT {
  key: string
  title: string
}

const { TabPane } = Tabs

export default function AuthMainRole() {
  const [form] = Form.useForm()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer([] as Array<RoleProvResp>)
  // const [roleFlag, setRoleFlag] = useState<boolean>()
  const [activeKey, setActiveKey] = useState<HookName>('postAuthentication')
  const [hooks, setHooks] = useImmer<HookResp[]>([])
  const [tabs, setTabs] = useState<TabT[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>()

  // 角色管理的相关函数
  const getData = useCallback(async () => {
    const authentication = await requests.get<unknown, Array<RoleProvResp>>('/role')
    setRoleData(authentication)
    console.log(authentication, 'authentication')
  }, [])

  useEffect(() => {
    void getData()
  }, [])

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
        <span
          className="pl-0 text-red-500"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            void handleDeleteRole(id)
          }}
        >
          删除
        </span>
      ),
    },
  ]

  // 身份鉴权相关
  useEffect(() => {
    getFetcher<HookResp[]>('/auth/hooks')
      .then(res => setHooks(res))
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  useEffect(() => {
    void requests
      .get<unknown, HookResp[]>('/auth/hooks')
      .then(res => {
        setHooks(res)
        return res
      })
      .then(res => setTabs(res.map(x => ({ key: x.hookName, title: x.hookName }))))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currHook = useMemo(() => hooks?.find(x => x.hookName === activeKey), [activeKey, hooks])

  const save = () => {
    void requests.put('/auth/hooks', {
      hookName: activeKey,
      content: currHook?.content,
      hookSwitch: currHook?.hookSwitch,
    })
    setRefreshFlag(!refreshFlag)
  }

  function handleEditorChange(value: string | undefined) {
    if (!value) return

    setHooks(draft => {
      let hook = draft.find(x => x.hookName === activeKey)
      if (!hook) hook = { content: '', fileName: '', hookName: activeKey, hookSwitch: false }
      hook.content = value
    })
  }

  function toggleSwitch() {
    void requests.post('/auth/hooks', {
      hookName: activeKey,
      hookSwitch: !currHook?.hookSwitch,
      content: currHook?.content,
    })
    setRefreshFlag(!refreshFlag)
  }

  const onChangeMange = (key: string) => {
    console.log(key, 'onchangeMange')
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
              onFinish={values => {
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
                rowKey={record => record.id}
                rowClassName={(record, index) => (index % 2 === 1 ? styles['role-table'] : '')}
                pagination={false}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={[]}
                rowKey={record => record.id}
                rowClassName={(record, index) => (index % 2 === 1 ? styles['role-table'] : '')}
                pagination={false}
              />
            )}
          </div>
        </TabPane>
        <TabPane tab="身份鉴权" key="2">
          <div>
            {/* @ts-ignore */}
            <RcTab tabs={tabs} onTabClick={setActiveKey} activeKey={activeKey} />
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
                <div className="text-[#E92E5E] cursor-pointer" onClick={save}>
                  <span className="leading-20px ml-1">保存</span>
                </div>
                <Switch onClick={toggleSwitch} checked={currHook?.hookSwitch} />
              </div>
            </div>
            <Editor
              height="90vh"
              defaultLanguage="typescript"
              defaultValue="// some comment"
              value={currHook?.content}
              onChange={value => handleEditorChange(value)}
              className={`mt-4 ${styles.monaco}`}
            />
          </div>
        </TabPane>
      </Tabs>
    </>
  )
}
