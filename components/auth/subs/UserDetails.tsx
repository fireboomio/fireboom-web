import Editor, { loader } from '@monaco-editor/react'
import { Button, Table, Modal, Form, Input, Tabs, Select, Col, Row } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
// import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
// import requests from '@/lib/fetchers'

import styles from './subs.module.scss'

loader.config({ paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs' } })

interface RoleProvResp {
  id: number
  code: string
  remark: string
  create_time: string | number
}

const { TabPane } = Tabs
const { Option } = Select

export default function AuthMainUserDetails() {
  const [form] = Form.useForm()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer([] as Array<RoleProvResp>)

  const onFinish = (values: RoleProvResp) => {
    console.log('Success:', values)
  }
  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const handleDeleteRole = (id: number) => {
    console.log('Delete role:', id)
  }

  const onChangeMange = (key: string) => {
    console.log(key, 'onchangeMange')
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

  return (
    <>
      <Tabs defaultActiveKey="1" onChange={onChangeMange}>
        <TabPane tab="用户信息" key="1">
          <div className="mt-9 mb-3.5 ml-6">个人信息</div>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={(values) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              void onFinish(values)
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            labelAlign="left"
          >
            <Row>
              <Col span={8}>
                <Form.Item label="姓名" name="username">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="用户名" name="password">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="昵称" name="password">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="性别" name="username">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="生日" name="password">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="手机号" name="password">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="邮箱" name="username">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="国家代码" name="password">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="所在地" name="password">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="公司" name="username">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="城市" name="password">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="省/区" name="password">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="街道地址" name="username">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="城市" name="password">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="原系统ID" name="password">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Form.Item>
                  <Button>重置</Button>
                  <Button className={`${styles['save-btn']} ml-4`} htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className="flex justify-between items-center">
            <span>原始json数据</span>
            <div>
              <IconFont type="icon-fuzhi" className="text-[20px]" />
              <span>复制</span>
            </div>
          </div>
          <Editor
            height="90vh"
            defaultLanguage="typescript"
            defaultValue="// some comment"
            className={`mt-4 ${styles.monaco}`}
          />
        </TabPane>
        <TabPane tab="角色权限" key="2">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base text-gray">用户角色</span>
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
            title="用户角色"
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
                <span>确定</span>
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
                label="选择角色"
                name="code"
                rules={[{ required: true, message: '请选择你的角色' }]}
              >
                <Select placeholder="Please select a country">
                  <Option value="china">China</Option>
                  <Option value="usa">U.S.A</Option>
                </Select>
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
      </Tabs>
    </>
  )
}
