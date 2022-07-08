import { Button, Table, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useImmer } from 'use-immer'

import styles from './auth-common-main.module.scss'

interface DataType {
  key: number
  name: string
  description: string
  time?: string
}

const data: DataType[] = [
  {
    key: 1,
    name: 'John Brown',
    description: '普通用户',
    time: '2022-06-22 12:34:12',
  },
  {
    key: 2,
    name: 'Jim Green',
    description: '普通用户',
    time: '2022-06-22 12:34:12',
  },
  {
    key: 3,
    name: 'Joe Black',
    description: '普通用户',
    time: '2022-06-22 12:34:12',
  },
  {
    key: 4,
    name: 'mako',
    description: '普通用户',
    time: '2022-06-22 12:34:12',
  },
]

export default function AuthMainRole() {
  const [form] = Form.useForm()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer(data)
  const onFinish = (values: DataType) => {
    setRoleData(
      roleData.concat({
        key: roleData.length + 1,
        name: values.name,
        description: values.description,
      })
    )
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const handleDeleteRole = (key: number) => {
    setRoleData(
      roleData.filter((row) => {
        return row.key !== key
      })
    )
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '角色',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'age',
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      key: 'address',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, { key }) => (
        <Button
          type="text"
          className="pl-0 text-red-500"
          onClick={() => {
            handleDeleteRole(key)
          }}
        >
          删除
        </Button>
      ),
    },
  ]

  return (
    <>
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
          name="basic"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
          className="h-30 mt-8 ml-8"
        >
          <Form.Item
            label="角色code"
            name="name"
            rules={[{ required: true, message: 'Please input your roleCode!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="角色描述" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <div className={styles['role-container-table']}>
        <Table
          columns={columns}
          dataSource={roleData}
          rowClassName={(record, index) => (index % 2 === 1 ? styles['role-table'] : '')}
          pagination={false}
        />
      </div>
    </>
  )
}
