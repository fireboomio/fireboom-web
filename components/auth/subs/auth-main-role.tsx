/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Table, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './auth-common-main.module.scss'

interface RoleProvResp {
  id: number
  code: string
  remark: string
}

export default function AuthMainRole() {
  const [form] = Form.useForm()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer([] as Array<RoleProvResp>)

  const getData = useCallback(async () => {
    const result = await requests.get<unknown, Array<RoleProvResp>>('/role')
    setRoleData(result)
    console.log(result, 'result')
  }, [])

  useEffect(() => {
    void getData()
  }, [])

  console.log(roleData, 'role')
  const onFinish = async (values: RoleProvResp) => {
    console.log('Success:', values)
    // const newRole = roleData.concat(values)
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
      dataIndex: 'time',
      key: 'time',
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
    </>
  )
}
