import { ExportOutlined } from '@ant-design/icons'
import { Badge, Button, Divider, Form, Input, Modal, Popconfirm, Switch, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { OAuthResp, User } from '@/interfaces/auth'
import { AuthUserCurrContext } from '@/lib/context/auth-context'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './subs.module.less'

const { Search } = Input

const tabItems = [
  {
    label: '用户名',
    key: '1',
    children: (
      <Form.Item label="用户名" name="name" rules={[{ required: true, message: '用户名不为空!' }]}>
        <Input />
      </Form.Item>
    )
  },
  {
    label: '手机号',
    key: '2',
    children: (
      <Form.Item
        label="手机号"
        name="mobile"
        rules={[{ required: true, message: '手机号不能为空!' }]}
      >
        <Input />
      </Form.Item>
    )
  },
  {
    label: '邮箱',
    key: '3',
    children: (
      <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '邮箱不能为空!' }]}>
        <Input />
      </Form.Item>
    )
  }
]

export default function AuthUser() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [userVisible, setUserVisible] = useImmer(false)
  const [userData, setUserData] = useImmer<User[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currPage, _setCurrPage] = useImmer(1)
  const [refreshFlag, setRefreshFlag] = useImmer(true)
  const { setAuthUserCurr } = useContext(AuthUserCurrContext)

  useEffect(() => {
    void getFetcher<OAuthResp>('/oauth', { currPage: currPage }).then(res =>
      setUserData(res.userList)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  const onFinish = (values: User) => {
    void requests.post('/oauth', values).then(() => setRefreshFlag(!refreshFlag))
  }

  const columns: ColumnsType<User> = [
    { title: '用户', dataIndex: 'userName', key: 'userName' },
    { title: '手机号', dataIndex: 'mobile', key: 'mobile' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '状态',
      key: 'status',
      render: (_, rcd) =>
        !rcd.status ? (
          <div>
            <Badge status="success" />
            正常
          </div>
        ) : (
          <div className="text-[#F79500]">
            <IconFont type="icon-lock" className="text-[10px] mr-1" />
            <span>锁定</span>
          </div>
        )
    },
    { title: '最后登入时间', dataIndex: 'lastLoginTime', key: 'lastLoginTime' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) =>
        userData.length >= 1 ? (
          <>
            <Popconfirm
              title={!record.status ? '确定要锁定' : '确定要解锁'}
              okText="确定"
              cancelText="取消"
              onConfirm={e => {
                // @ts-ignore
                e.stopPropagation()
                toggleLock(record)
              }}
              // @ts-ignore
              onCancel={e => e.stopPropagation()}
            >
              <a onClick={e => e.stopPropagation()}>{!record.status ? '锁定' : '解锁'}</a>
            </Popconfirm>

            <Popconfirm
              title="确定要删除?"
              okText="确定"
              cancelText="取消"
              onConfirm={e => {
                // @ts-ignore
                e.stopPropagation()
                handleDelete([record.id])
              }}
              // @ts-ignore
              onCancel={e => e.stopPropagation()}
            >
              <a className="ml-2" onClick={e => e.stopPropagation()}>
                删除
              </a>
            </Popconfirm>
          </>
        ) : null
    }
  ]

  const handleDelete = (keys: React.Key[]) => {
    void requests.delete('/oauth', { data: { ids: keys } }).then(() => setRefreshFlag(!refreshFlag))
  }

  const toggleLock = (rcd: User | React.Key[]) => {
    if (Array.isArray(rcd)) {
      void requests
        .put('/oauth/status', { ids: rcd, status: false })
        .then(() => setRefreshFlag(!refreshFlag))
    } else {
      void requests
        .put('/oauth/status', { ids: [rcd.id], status: !rcd.status })
        .then(() => setRefreshFlag(!refreshFlag))
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    }
  }

  const hasSelected = selectedRowKeys.length > 0

  const paginationProps = {
    showSizeChanger: false,
    showQuickJumper: false,
    pageSize: 10,
    current: currPage,
    onChange: (current: number) => changePage(current)
  }

  function changePage(current: number) {
    console.log(current)
    void getFetcher<OAuthResp>('/oauth', { currPage: current, pageSize: 10 }).then(res => {
      console.log(res)
      setUserData(res.userList)
    })
  }

  function search(value: string) {
    void getFetcher<OAuthResp>('/oauth', { search: value }).then(res => setUserData(res.userList))
  }

  function exportUsers(keys?: React.Key[]) {
    void requests.post('/oauth/export', { ids: keys }).then(res => {
      console.log(res)
    })
  }

  function handleRowClick(rcd: User) {
    // void router.push({
    //   pathname: '/auth/user-manage/[id]',
    //   query: { id: 1 },
    // })
    navigate(`/auth/userDetail/${rcd.id}`)
  }

  return (
    <>
      <div>
        <span className="text-base text-gray mr-4">用户列表</span>
        <span className={styles['auth-head']}>当前用户池的所有用户，在这里你可以对用户</span>
      </div>
      <Divider style={{ margin: 10 }} />

      <div className="flex justify-between items-center mb-2">
        <Search
          placeholder="搜索用户名、邮箱或手机号"
          style={{ width: 228, height: 32 }}
          onSearch={search}
        />
        <div className="flex items-center mb-2">
          <Button
            className={`${styles['connect-check-btn-common']} w-20 ml-4`}
            onClick={() => exportUsers()}
          >
            <span className="text-sm text-gray">导出全部</span>
          </Button>
          <Button className={`${styles['connect-check-btn-common']} w-16 ml-4`}>
            <span className="text-sm text-gray">导入</span>
          </Button>
          <Button className={`${styles['save-btn']} ml-4`} onClick={() => setUserVisible(true)}>
            <span className="text-sm text-gray">创建</span>
          </Button>
        </div>
      </div>
      <Divider style={{ margin: 0 }} />

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={userData}
        bordered={true}
        size="small"
        rowKey={record => record.id}
        rowClassName="cursor-pointer"
        onRow={rcd => ({
          onClick: () => handleRowClick(rcd)
        })}
        pagination={paginationProps}
      />

      {hasSelected ? (
        <div className="flex border px-5 py-3 w-140">
          <div className={styles['right-style']}>
            已选择
            <span>{selectedRowKeys.length}</span>个
          </div>

          <div className={styles['btn-style']}>
            <Button
              className="mr-2 ml-10 text-[#e92e5e]"
              icon={<IconFont type="icon-lock" className="text-[16px]" />}
              onClick={() => toggleLock(selectedRowKeys)}
            >
              锁定
            </Button>
            <Button
              className="mr-2"
              icon={<IconFont type="icon-shanchu" className="text-[16px]" />}
              onClick={() => handleDelete(selectedRowKeys)}
            >
              删除
            </Button>
            <Button icon={<ExportOutlined />} onClick={() => exportUsers(selectedRowKeys)}>
              导出
            </Button>
            <Divider type="vertical" className={styles['modal-divider']} />
          </div>
          <Button>取消选择</Button>
        </div>
      ) : (
        ''
      )}

      <Modal
        mask={false}
        title="创建用户"
        style={{ top: '200px' }}
        width={549}
        bodyStyle={{ height: '350px' }}
        open={userVisible}
        onOk={() => {
          form.submit()
          // setUserVisible(false)
        }}
        onCancel={() => setUserVisible(false)}
        okText={
          <Button className={styles['save-btn']} onClick={() => form.submit()}>
            <span>确定</span>
          </Button>
        }
        okType="text"
        cancelText="取消"
      >
        <Form
          name="userList"
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          initialValues={{ remember: true }}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          onFinish={values => void onFinish(values)}
          autoComplete="off"
          labelAlign="right"
          className="h-30 mt-8 ml-8"
        >
          <div className={styles['tabs-style']}>
            <Tabs defaultActiveKey="1" type="card" items={tabItems} />
          </div>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请再次输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="rePassword"
            rules={[
              { required: true, message: '请再次输入密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('密码不一致!'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <span className="ml-10 mr-2">发送首次登入地址</span>
            <Switch className={`${styles['switch-edit-btn']}`} size="small" />
          </Form.Item>
          <Form.Item valuePropName="checked" colon={false}>
            <span className="ml-10 mr-2">强制用户在首次登录时修改密码</span>
            <Switch className={`${styles['switch-edit-btn']}`} size="small" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
