import { Input, Button, Modal, Form, Table, Divider, Switch, Tabs, Popconfirm, Badge } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { useState } from 'react'
import { useImmer } from 'use-immer'

import type { AuthListType } from '@/interfaces/auth'

import styles from './subs.module.scss'

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
}

interface UserProvResp {
  id: number
  key: React.Key
  name: string
  phoneNumber: string
  email: string
  status: string
  lastLoginTime: string
}

const { Search } = Input

const { TabPane } = Tabs

const onSearch = (value: string) => console.log(value)

const data: UserProvResp[] = [
  {
    id: 1,
    key: 1,
    name: 'Alean',
    phoneNumber: '18189156130',
    email: '1278154346@qq.com',
    status: '正常',
    lastLoginTime: '2022-06-27 15:47:14',
  },
  {
    id: 2,
    key: 2,
    name: 'Alean',
    phoneNumber: '18189156130',
    email: '1278154346@qq.com',
    status: '正常',
    lastLoginTime: '2022-06-27 15:47:14',
  },
]

export default function AuthMainUser({ handleTopToggleDesigner }: Props) {
  const [form] = Form.useForm()
  const [userVisible, setUserVisible] = useImmer(false)
  // const [userData, setUserData] = useImmer([] as Array<UserProvResp>)
  const [userData, setUserData] = useImmer(data)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onFinish = (values: UserProvResp) => {
    console.log('Success:', values)
    setUserData(
      userData.concat({
        ...values,
        key: userData.length + 1,
      })
    )
    // await requests.post('/role', values)
    // await getData()
  }
  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const columns: ColumnsType<UserProvResp> = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <span>
          <Badge status="success" />
          正常
        </span>
      ),
    },
    {
      title: '最后登入时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, { key }) =>
        userData.length >= 1 ? (
          <div>
            <Popconfirm
              title="确定要锁定?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleUserDelete(key)}
            >
              <a>锁定</a>
            </Popconfirm>
            <Popconfirm
              title="确定要删除?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleUserDelete(key)}
            >
              <a className="ml-2">删除</a>
            </Popconfirm>
          </div>
        ) : null,
    },
  ]

  const handleUserDelete = (key: React.Key) => {
    setUserData(
      userData.filter((row) => {
        return row.key !== key
      })
    )
  }

  // const handleUserDelete = (id: number) => {
  //   data.filter((item) => {
  //     item.id !== id
  //   })
  // }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<UserProvResp> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
          setSelectedRowKeys(newSelectedRowKeys)
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
          setSelectedRowKeys(newSelectedRowKeys)
        },
      },
    ],
  }
  return (
    <>
      <div>
        <div>
          <span className="text-base text-gray mr-4">用户列表</span>
          <span className={styles['auth-head']}>当前用户池的所有用户，在这里你可以对用户</span>
        </div>
        <Divider style={{ margin: 10 }} />
        <div className="flex justify-between items-center mb-2">
          <Search
            placeholder="搜索用户名、邮箱或手机号"
            onSearch={onSearch}
            style={{ width: 228, height: 32 }}
          />
          <div className="flex items-center mb-2">
            <Button className={`${styles['connect-check-btn-common']} w-20 ml-4`}>
              <span className="text-sm text-gray">导出全部</span>
            </Button>
            <Button className={`${styles['connect-check-btn-common']} w-16 ml-4`}>
              <span className="text-sm text-gray">导入</span>
            </Button>
            <Button
              className={`${styles['save-btn']} ml-4`}
              onClick={() => {
                setUserVisible(true)
              }}
            >
              <span className="text-sm text-gray">创建</span>
            </Button>
          </div>
        </div>
        <div>
          <Modal
            mask={false}
            title="创建用户"
            style={{ top: '200px' }}
            width={549}
            bodyStyle={{ height: '350px' }}
            transitionName=""
            visible={userVisible}
            onOk={() => setUserVisible(false)}
            onCancel={() => setUserVisible(false)}
            okText={
              <Button
                className={styles['save-btn']}
                onClick={() => {
                  form.submit()
                }}
              >
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
              onFinish={(values) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                void onFinish(values)
              }}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              labelAlign="right"
              className="h-30 mt-8 ml-8"
            >
              <div className={styles['tabs-style']}>
                <Tabs defaultActiveKey="1" type="card">
                  <TabPane tab="用户名" key="1">
                    <Form.Item
                      label="用户名"
                      name="name"
                      rules={[{ required: true, message: '用户名不为空!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </TabPane>
                  <TabPane tab="手机号" key="2">
                    <Form.Item
                      label="手机号"
                      name="phoneNumber"
                      rules={[{ required: true, message: '手机号不能为空!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </TabPane>
                  <TabPane tab="邮箱" key="3">
                    <Form.Item
                      label="邮箱"
                      name="email"
                      rules={[{ required: true, message: '邮箱不能为空!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </TabPane>
                </Tabs>
              </div>
              <Form.Item label="密码" name="password">
                <Input.Password />
              </Form.Item>
              <Form.Item label="确认密码" name="confirmPassword">
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
        </div>
        <Divider style={{ margin: 0 }} />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          bordered={true}
          size="small"
          onRow={() => {
            return {
              onClick: () => {
                handleTopToggleDesigner({ name: '用户详情', type: 'userDetails' })
              }, // 点击行
            }
          }}
        />
      </div>
    </>
  )
}
