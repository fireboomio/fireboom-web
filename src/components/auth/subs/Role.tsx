/* eslint-disable react-hooks/exhaustive-deps */
import { loader } from '@monaco-editor/react'
import { Button, Form, Input, Modal, Popconfirm, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'

import IdeContainer from '@/components/Ide'
import getDefaultCode from '@/components/Ide/getDefaultCode'
import RcTab from '@/components/rc-tab'
import type { HookName, HookResp } from '@/interfaces/auth'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './subs.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

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
export const hookPath: Record<string, string> = {
  postAuthentication: 'auth/postAuthentication',
  mutatingPostAuthentication: 'auth/mutatingPostPreResolve'
}
export default function AuthRole() {
  const [form] = Form.useForm()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer([] as Array<RoleProvResp>)
  const [roleFlag, setRoleFlag] = useState<boolean>()
  const [activeKey, setActiveKey] = useState<HookName>('postAuthentication')
  const [hooks, setHooks] = useImmer<HookResp[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [defaultCode, setDefaultCode] = useState<string>('')

  const tabs = [
    { key: 'postAuthentication', title: 'postAuthentication' },
    { key: 'mutatingPostAuthentication', title: 'mutatingPostAuthentication' }
  ]

  // 角色管理的相关函数
  // const getData = useCallback(async () => {
  //   const authentication = await requests.get<unknown, Array<RoleProvResp>>('/role')
  //   setRoleData(authentication)
  //   console.log(authentication, 'authentication')
  // }, [])

  useEffect(() => {
    void requests.get<unknown, Array<RoleProvResp>>('/role').then(res => {
      setRoleData(res)
    })
  }, [roleFlag])

  const onFinish = async (values: RoleProvResp) => {
    await requests.post('/role', values)
    setRoleFlag(!roleFlag)
  }

  const handleDeleteRole = async (id: number) => {
    await requests.delete(`/role/${id}`)
    setRoleFlag(!roleFlag)
  }
  const columns: ColumnsType<RoleProvResp> = [
    {
      title: '角色',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '角色描述',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 4,
      render: (_, { id }) => (
        <Popconfirm
          title="确定要删除?"
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            void handleDeleteRole(id)
          }}
        >
          <span className="pl-0 text-red-500 cursor-pointer">删除</span>
        </Popconfirm>
      )
    }
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

  const currHook = useMemo(() => hooks?.find(x => x.hookName === activeKey), [activeKey, hooks])
  useEffect(() => {
    setDefaultCode('')
    getDefaultCode(activeKey).then(res => {
      setDefaultCode(res)
    })
  }, [activeKey])

  const save = () => {
    void requests.post('/auth/hooks', {
      hookName: activeKey,
      content: currHook?.content,
      hookSwitch: currHook?.hookSwitch
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
      content: currHook?.content
    })
    setRefreshFlag(!refreshFlag)
  }
  const [tab, setTab] = useState<string>('role')
  return (
    <div className="relative">
      {tab === 'role' ? (
        <div className="absolute top-2px right-0">
          <Button
            className="px-4 py-0 h-7.5"
            onClick={() => {
              setModal1Visible(true)
            }}
          >
            <span className="text-sm text-gray">添加</span>
          </Button>
        </div>
      ) : (
        ''
      )}
      <Tabs
        renderTabBar={(props, DefaultTabBar) => {
          return <DefaultTabBar className={styles.pillTab} {...props} />
        }}
        onChange={setTab}
      >
        <TabPane tab="角色管理" key="role" className={styles.tabContent}>
          <Modal
            mask={false}
            title="添加"
            style={{ top: '200px' }}
            width={549}
            transitionName=""
            open={modal1Visible}
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
              autoComplete="off"
              labelAlign="left"
              className="h-30 mt-8 ml-8"
            >
              <Form.Item
                label="角色code"
                name="code"
                rules={[
                  { required: true, message: '请输入角色编码' },
                  {
                    pattern: /^[_a-zA-Z][_a-zA-Z\d]*$/g,
                    message: '请输入数字、字母或下划线，第一位不能是数字'
                  }
                ]}
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
        <TabPane tab="身份鉴权" key="auth" className={styles.tabContent}>
          <div>
            {/* @ts-ignore */}
            <RcTab tabs={tabs} onTabClick={setActiveKey} activeKey={activeKey} />
            <IdeContainer
              key={hookPath[activeKey]}
              hookPath={hookPath[activeKey]}
              defaultLanguage="typescript"
              onChange={console.log}
              defaultCode={defaultCode}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}
