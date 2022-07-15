import { Button, Table, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import styles from './auth-common-main.module.scss'
interface FromValues {
  [key: string]: number | string | boolean
}
interface RoleProvResp {
  id: number
  code: string
  remark: string
  time?: string
}

interface Response {
  status: number
  data: { result: RoleProvResp[]; [key: string]: number | string | boolean | object }
  [key: string]: number | string | boolean | object
}
// const data: RoleProvResp[] = [
//   {
//     key: 1,
//     name: 'John Brown',
//     description: '普通用户',
//     time: '2022-06-22 12:34:12',
//   },
//   {
//     key: 2,
//     name: 'Jim Green',
//     description: '普通用户',
//     time: '2022-06-22 12:34:12',
//   },
//   {
//     key: 3,
//     name: 'Joe Black',
//     description: '普通用户',
//     time: '2022-06-22 12:34:12',
//   },
//   {
//     key: 4,
//     name: 'mako',
//     description: '普通用户',
//     time: '2022-06-22 12:34:12',
//   },
// ]

export default function AuthMainRole() {
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useImmer(true)
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const initData: RoleProvResp[] = []
  const [roleData, setRoleData] = useImmer(initData)
  const fetchData = async () => {
    const res: Response = await axios.get('/role')
    const { result } = res.data
    setRoleData(result)
  }
  useEffect(() => {
    fetchData
  }, [])
  const onFinish = async (values: object) => {
    console.log('Success:', values)
    console.log(JSON.stringify(values))
    await axios.put('/role', values)
    const newdata: Response = await axios.get('/role')
    const { result } = newdata.data
    setRoleData(result)
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (changedValues: object, allValues: FromValues) => {
    console.log(allValues)
    for (const key in allValues) {
      if ((allValues[key] as string) == undefined || allValues[key] == '') {
        setDisabled(true)
        return
      }
    }
    setDisabled(false)
  }

  const handleDeleteRole = async (item: RoleProvResp) => {
    const res: Response = await axios.delete(`/role/${item.id}`)
    const { result } = res.data
    setRoleData(result)
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
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      key: 4,
      render: (_, content) => (
        <Button
          type="text"
          className="pl-0 text-red-500"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            void handleDeleteRole(content)
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
            disabled={disabled}
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
          onFinish={(values) => {
            void onFinish(values as object)
          }}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
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
