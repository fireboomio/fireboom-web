/* eslint-disable react-hooks/exhaustive-deps */
import { loader } from '@monaco-editor/react'
import { Button, Form, Input, Modal, Popconfirm, Switch, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import { getDefaultCode } from '@/components/Ide/getDefaultCode'
import type { HookName, HookResp } from '@/interfaces/auth'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import { getHook } from '@/lib/service/hook'

import styles from '../components/subs.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface RoleProvResp {
  id: number
  code: string
  remark: string
  create_time: string | number
}

export const hookPath: Record<string, string> = {
  postAuthentication: 'auth/postAuthentication',
  revalidate: 'auth/revalidate',
  postLogout: 'auth/postLogout',
  mutatingPostAuthentication: 'auth/mutatingPostAuthentication'
}
export default function AuthRole() {
  const intl = useIntl()
  const [form] = Form.useForm()
  const formId = Form.useWatch('id', form)
  const navigate = useNavigate()
  const { tab: tabKey } = useParams()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer([] as Array<RoleProvResp>)
  const [roleFlag, setRoleFlag] = useState<boolean>()
  const [activeKey, setActiveKey] = useState<HookName>('postAuthentication')
  const [hooks, setHooks] = useImmer<HookResp[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  // const [defaultCode, setDefaultCode] = useState<string>('')
  const [defaultCodeMap, setDefaultCodeMap] = useState<Record<string, string>>({})
  const postAuthentication = useSWRImmutable<any>('auth/postAuthentication', getHook)
  const revalidate = useSWRImmutable<any>('auth/revalidate', getHook)
  const postLogout = useSWRImmutable<any>('auth/postLogout', getHook)
  const mutatingPostAuthentication = useSWRImmutable<any>(
    'auth/mutatingPostAuthentication',
    getHook
  )
  const hookMap = { postAuthentication, revalidate, postLogout, mutatingPostAuthentication }
  // const tabs = [
  //   { key: 'postAuthentication', title: 'postAuthentication' },
  //   { key: 'revalidate', title: 'revalidate' },
  //   { key: 'mutatingPostAuthentication', title: 'mutatingPostAuthentication' },
  //   { key: 'postLogout', title: 'postLogout' }
  // ]

  // 角色管理的相关函数
  // const getData = useCallback(async () => {
  //   const authentication = await requests.get<unknown, Array<RoleProvResp>>('/role')
  //   setRoleData(authentication)
  //   console.log(authentication, 'authentication')
  // }, [])

  useEffect(() => {
    requests.get<unknown, Array<RoleProvResp>>('/role').then(res => {
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
      title: intl.formatMessage({ defaultMessage: '角色' }),
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: intl.formatMessage({ defaultMessage: '角色描述' }),
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: intl.formatMessage({ defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: intl.formatMessage({ defaultMessage: '操作' }),
      key: 4,
      render: (_, row) => (
        <>
          <span
            className="cursor-pointer mr-1 pl-0 text-[#1677ff]"
            onClick={() => {
              form.setFieldsValue(row)
              setModal1Visible(true)
            }}
          >
            <FormattedMessage defaultMessage="编辑" />
          </span>
          <Popconfirm
            title={intl.formatMessage({ defaultMessage: '确定要删除?' })}
            okText={intl.formatMessage({ defaultMessage: '确定' })}
            cancelText={intl.formatMessage({ defaultMessage: '取消' })}
            onConfirm={() => {
              handleDeleteRole(row.id)
            }}
          >
            <span className="ml-4 cursor-pointer pl-0 text-[#1677ff]">
              <FormattedMessage defaultMessage="删除" />
            </span>
          </Popconfirm>
        </>
      )
    }
  ]

  // const currHook = useMemo(() => hooks?.find(x => x.hookName === activeKey), [activeKey, hooks])
  useEffect(() => {
    getDefaultCode(`auth.${activeKey}`).then(res => {
      setDefaultCodeMap({ ...defaultCodeMap, [activeKey]: res })
    })
  }, [activeKey])

  const { vscode } = useContext(GlobalContext)
  const [tab, setTab] = useState<string>('role')
  return (
    <div className="bg-[#fbfbfc] h-full p-3">
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
              <span className="text-sm text-gray">
                <FormattedMessage defaultMessage="添加" />
              </span>
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
          activeKey={tabKey}
          onTabClick={key => {
            navigate(`/workbench/auth/role/${key}`)
          }}
          items={[
            {
              label: intl.formatMessage({ defaultMessage: '角色管理' }),
              key: 'role',
              children: (
                <div className={styles.tabContent}>
                  {modal1Visible && (
                    <Modal
                      open
                      mask={false}
                      title={
                        formId
                          ? intl.formatMessage({ defaultMessage: '编辑角色' })
                          : intl.formatMessage({ defaultMessage: '添加角色' })
                      }
                      style={{ top: '200px' }}
                      width={549}
                      transitionName=""
                      onOk={() => {
                        form.submit()
                      }}
                      onCancel={() => setModal1Visible(false)}
                      okText={intl.formatMessage({ defaultMessage: '保存' })}
                      okButtonProps={{ className: styles['save-btn'] }}
                      okType="text"
                      cancelText={intl.formatMessage({ defaultMessage: '取消' })}
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
                          label={intl.formatMessage({ defaultMessage: '角色code' })}
                          name="code"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ defaultMessage: '请输入角色编码' })
                            },
                            {
                              pattern: /^[_a-zA-Z][_a-zA-Z\d]*$/g,
                              message: intl.formatMessage({
                                defaultMessage: '请输入数字、字母或下划线，第一位不能是数字'
                              })
                            }
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={intl.formatMessage({ defaultMessage: '角色描述' })}
                          name="remark"
                        >
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
              label: intl.formatMessage({ defaultMessage: '身份鉴权' }),
              key: 'auth',
              children: (
                <div className={styles.tabContent}>
                  <div className={styles.table}>
                    {Object.keys(hookPath).map(name => (
                      <div key={name} className={styles.row}>
                        <div className={styles.name}>{name}</div>
                        <Switch
                          checked={hookMap?.[name]?.data?.enabled}
                          onChange={async flag => {
                            await vscode.toggleHook(flag, hookPath[name])
                            hookMap?.[name]?.mutate?.()
                          }}
                        />
                        <div className={styles.btn} onClick={() => vscode.show(hookPath[name])}>
                          编辑
                        </div>
                      </div>
                    ))}
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
