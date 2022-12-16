/* eslint-disable react-hooks/exhaustive-deps */
import { loader } from '@monaco-editor/react'
import { Button, Form, Input, Modal, Popconfirm, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'

import IdeContainer from '@/components/Ide'
import getDefaultCode from '@/components/Ide/getDefaultCode'
import type { HookName, HookResp } from '@/interfaces/auth'
import requests from '@/lib/fetchers'

import styles from './components/subs.module.less'

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
  revalidate: 'auth/revalidate',
  postLogout: 'auth/postLogout',
  mutatingPostAuthentication: 'auth/mutatingPostAuthentication'
}
export default function AuthRole() {
  const [form] = Form.useForm()
  const formId = Form.useWatch('id', form)
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer([] as Array<RoleProvResp>)
  const [roleFlag, setRoleFlag] = useState<boolean>()
  const [activeKey, setActiveKey] = useState<HookName>('postAuthentication')
  const [hooks, setHooks] = useImmer<HookResp[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  // const [defaultCode, setDefaultCode] = useState<string>('')
  const [defaultCodeMap, setDefaultCodeMap] = useState<Record<string, string>>({})

  const tabs = [
    { key: 'postAuthentication', title: 'postAuthentication' },
    { key: 'revalidate', title: 'revalidate' },
    { key: 'mutatingPostAuthentication', title: 'mutatingPostAuthentication' },
    { key: 'postLogout', title: 'postLogout' }
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
    await requests[values.id ? 'put' : 'post']('/role', { ...values })
    setModal1Visible(false)
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
      render: (_, row) => (
        <>
          <span
            className="cursor-pointer pl-0 text-red-500 mr-1"
            onClick={() => {
              form.setFieldsValue(row)
              setModal1Visible(true)
            }}
          >
            编辑
          </span>
          <Popconfirm
            title="确定要删除?"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              void handleDeleteRole(row.id)
            }}
          >
            <span className="cursor-pointer pl-0 text-red-500">删除</span>
          </Popconfirm>
        </>
      )
    }
  ]

  const currHook = useMemo(() => hooks?.find(x => x.hookName === activeKey), [activeKey, hooks])
  useEffect(() => {
    getDefaultCode(`auth.${activeKey}`).then(res => {
      setDefaultCodeMap({ ...defaultCodeMap, [activeKey]: res })
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
    <div className="p-3 bg-[#fbfbfc] h-full">
      <div className={'relative h-full flex ' + styles.roleContainer}>
        {tab === 'role' ? (
          <div className="top-2px right-0 absolute">
            <Button
              className="h-7.5 py-0 px-4"
              onClick={() => {
                form.setFieldsValue({ id: undefined, code: '', remark: '' })
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
          className="h-full w-full"
          renderTabBar={(props, DefaultTabBar) => {
            return <DefaultTabBar className={styles.pillTab} {...props} />
          }}
          onChange={setTab}
          items={[
            {
              label: '角色管理',
              key: 'role',
              children: (
                <div className={styles.tabContent}>
                  {modal1Visible && (
                    <Modal
                      open
                      mask={false}
                      title={formId ? '编辑角色' : '添加角色'}
                      style={{ top: '200px' }}
                      width={549}
                      transitionName=""
                      onOk={() => {
                        form.submit()
                      }}
                      onCancel={() => setModal1Visible(false)}
                      okText="保存"
                      okButtonProps={{ className: styles['save-btn'] }}
                      okType="text"
                      cancelText="取消"
                    >
                      <Form
                        name="roleList"
                        form={form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        onFinish={values => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                          void onFinish({ ...values })
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
                        <Form.Item name="id"></Form.Item>
                        <Form.Item name="createTime"></Form.Item>
                      </Form>
                    </Modal>
                  )}
                  <div className={styles['role-container-table']}>
                    {roleData.length > 0 ? (
                      <Table
                        columns={columns}
                        dataSource={roleData}
                        rowKey={record => record.id}
                        rowClassName={(record, index) =>
                          index % 2 === 1 ? styles['role-table'] : ''
                        }
                        pagination={false}
                      />
                    ) : (
                      <Table
                        columns={columns}
                        dataSource={[]}
                        rowKey={record => record.id}
                        rowClassName={(record, index) =>
                          index % 2 === 1 ? styles['role-table'] : ''
                        }
                        pagination={false}
                      />
                    )}
                  </div>
                </div>
              )
            },
            {
              label: '身份鉴权',
              key: 'auth',
              children: (
                <div className={styles.tabContent}>
                  <div>
                    {/* @ts-ignore */}
                    <IdeContainer
                      key={hookPath[activeKey]}
                      hookPath={hookPath[activeKey]}
                      defaultLanguage="typescript"
                      onChange={console.log}
                      defaultCode={defaultCodeMap[activeKey]}
                    />
                  </div>
                </div>
              )
            }
          ]}
        ></Tabs>
      </div>
    </div>
  )
}
