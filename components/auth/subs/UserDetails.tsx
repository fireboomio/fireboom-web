import Editor, { loader } from '@monaco-editor/react'
import { Button, Table, Modal, Form, Input, Tabs, Select, Col, Row, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import { User } from '@/interfaces/auth'
import { AuthUserCurrContext } from '@/lib/context/auth-context'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './subs.module.scss'

loader.config({ paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs' } })

interface RoleProvResp {
  id: number
  code: string
  remark: string
}

const { TabPane } = Tabs
const { Option } = Select

export default function AuthUserDetails() {
  const [form] = Form.useForm()
  const [modal1Visible, setModal1Visible] = useImmer(false)
  const [roleData, setRoleData] = useImmer<RoleProvResp[]>([])
  const { authUserCurr, setAuthUserCurr } = useContext(AuthUserCurrContext)
  const [refreshFlag, setRefreshFlag] = useImmer(false)

  const onFinish = (values: User) => {
    void requests.put(`/oauth/${authUserCurr.id}`, { values })
  }

  useEffect(() => {
    void getFetcher<RoleProvResp[]>(`/oauth/role/${authUserCurr.id}`).then(x => setRoleData(x))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserCurr.id, refreshFlag])

  const columns: ColumnsType<RoleProvResp> = [
    { title: '角色', dataIndex: 'code', key: 'code' },
    { title: '角色描述', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作',
      key: 4,
      render: (_, { id }) => (
        <span
          className="pl-0 text-red-500 cursor-pointer"
          onClick={() => void handleDeleteRole(id)}
        >
          撤销角色
        </span>
      ),
    },
  ]

  const handleDeleteRole = (id: number) => {
    void requests.post(`/oauth/role/${id}`).then(() => setRefreshFlag(!refreshFlag))
  }

  // @ts-ignore
  function handleValueChange(_, allVal) {
    // TODO:
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setAuthUserCurr(allVal)
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="用户信息" key="1">
        <div className={styles['user-info']}>个人信息</div>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 20 }}
          initialValues={authUserCurr}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          onFinish={values => void onFinish(values)}
          autoComplete="off"
          labelAlign="left"
          className={styles['form-style']}
          onValuesChange={handleValueChange}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="用户名" name="name">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="昵称" name="nickName">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="姓名"
                name="metaData.realname"
                initialValue={authUserCurr.metaData?.realname}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="性别" name="metaData.gender">
                <Select placeholder="请输入">
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="生日" name="metaData.birthday">
                {/* <Space direction="vertical"> */}
                <DatePicker placeholder="请输入" />
                {/* </Space> */}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="手机号" name="mobile">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="邮箱" name="email">
                <Input
                  placeholder="请输入"
                  // suffix={<span className="text-[#E92E5E] h-5">发送验证码</span>}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="邮政编码"
                name="metaData.postCode"
                initialValue={authUserCurr.metaData?.postCode}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="原系统ID" name="metaData.originID">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button className={`${styles['connect-check-btn-common']} w-15 ml-4`}>
                  <span className="text-sm text-gray" onClick={() => form.resetFields()}>
                    重置
                  </span>
                </Button>
                <Button className={`${styles['save-btn']} ml-4`} htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={`${styles['mid-word']} flex justify-between items-center`}>
          <span>原始json数据</span>
          <div className={styles['right-word']}>
            <IconFont type="icon-fuzhi" className="text-[10px] text-[#E92E5E]" />
            <span>复制</span>
          </div>
        </div>
        <Editor
          height="90vh"
          defaultLanguage="typescript"
          defaultValue=""
          value={JSON.stringify(authUserCurr, null, 2)}
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
          style={{ top: '300px' }}
          transitionName=""
          open={modal1Visible}
          onOk={() => setModal1Visible(false)}
          onCancel={() => setModal1Visible(false)}
          okText={
            <Button className={styles['save-btn']} onClick={() => form.submit()}>
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
            onFinish={values => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              void onFinish(values)
            }}
            autoComplete="off"
            labelAlign="left"
            className="h-30 mt-8 ml-8"
          >
            <Form.Item
              label="选择角色"
              name="code"
              rules={[{ required: true, message: '请选择你的角色' }]}
            >
              <Select>
                <Option value="1">
                  <span className="mr-2 text-lg ">user</span>
                  <span className="text-[#AFB0B4] text-xs ">普通用户</span>
                </Option>
              </Select>
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
    </Tabs>
  )
}
