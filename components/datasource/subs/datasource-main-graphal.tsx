import { CaretRightOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Switch,
  Descriptions,
  Collapse,
  Form,
  Input,
  Checkbox,
  Upload,
  Space,
  Select,
} from 'antd'
import { ReactNode, useContext } from 'react'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context'

import styles from './datasource-common.module.scss'

interface Props {
  content: DatasourceResp
  type: string
}
interface Config {
  [key: string]: ReactNode
}

export default function DatasourceGraphalMainCheck({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const [form] = Form.useForm()
  const { Option } = Select
  const { Panel } = Collapse
  const config = JSON.parse(content.config) as Config

  const onFinish = (values: object) => {
    handleToggleDesigner('data', content.id)
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  const connectSwitchOnChange = () => {
    console.log('switch change')
  }

  if (!content) {
    return <></>
  }

  return (
    <>
      {type === 'data' ? (
        <>
          <div className="pb-17px flex items-center justify-between border-gray border-b mb-8">
            <div>
              <span className="ml-2">
                userinfo <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center">
              <Switch
                defaultChecked
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className={styles['switch-check-btn']}
              />
              <div className="w-144px">
                <Button className={styles['design-btn']}>
                  <span>设计</span>
                </Button>
                <Button
                  className={styles['edit-btn']}
                  onClick={() => {
                    handleToggleDesigner('edit', content.id)
                  }}
                >
                  <span>编辑</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <Descriptions
              bordered
              column={1}
              size="small"
              className={styles['descriptions-box']}
              labelStyle={{
                backgroundColor: 'white',
                width: '30%',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>命名空间</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.nameScope}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>Graphql 端点</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.endpoint}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>指定Schema</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.theOAS}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <h2 className="ml-3 mb-3">请求头</h2>
          <div className="flex justify-center mb-8">
            <Descriptions
              bordered
              column={3}
              size="small"
              className={styles['descriptions-box']}
              labelStyle={{
                backgroundColor: 'white',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item>{config.head}</Descriptions.Item>
              <Descriptions.Item>{config.way}</Descriptions.Item>
              <Descriptions.Item>{config.code}</Descriptions.Item>
            </Descriptions>
          </div>

          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className={`${styles['collapse-box']} site-collapse-custom-collapse bg-light-50`}
          >
            <Panel header="更多" key="1" className="site-collapse-custom-panel">
              <div className="flex justify-center mb-8">
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  className={styles['descriptions-box']}
                  labelStyle={{
                    backgroundColor: 'white',
                    width: '30%',
                    borderRight: 'none',
                    borderBottom: 'none',
                  }}
                >
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>是否内部</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.isInside}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>自定义Float标量</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.isFloat}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>自定义INT标量</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.isInt}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>排除重命名根字段</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.isRename}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Panel>
          </Collapse>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between border-gray border-b">
            <div>
              <span className="ml-2">
                {content.name} <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center mb-2 w-144px">
              <Button className={styles['design-btn']}>
                <span>取消</span>
              </Button>
              <Button
                className={styles['edit-btn']}
                onClick={() => {
                  form.submit()
                }}
              >
                <span>保存</span>
              </Button>
            </div>
          </div>

          <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 11 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger="onBlur"
              className="ml-3"
              labelAlign="left"
            >
              <Form.Item
                label={
                  <div className="">
                    <span className={styles['label-style']}>命名空间:</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                style={{ marginBottom: '20px' }}
                name="nameSpace"
              >
                <Input placeholder="请输入..." />
              </Form.Item>

              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>Graphql 端点:</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                required
                style={{ marginBottom: '20px' }}
                name="GraphqlPort"
              >
                <Input placeholder="请输入..." />
              </Form.Item>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('')),
                  },
                ]}
              >
                <Checkbox>通过发送指令,自动内省Schema</Checkbox>
              </Form.Item>
              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>指定Schema:</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                required
                style={{ marginBottom: '48px' }}
                name="schema"
              >
                <Upload name="logo" action="/upload.do" listType="picture">
                  <Button icon={<PlusOutlined />} className="w-147">
                    添加文件
                  </Button>
                </Upload>
              </Form.Item>
              <h2 className="ml-3 mb-3">请求头</h2>
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item className="w-60" name="reqHead" wrapperCol={{ span: 24 }}>
                  <Input />
                </Form.Item>
                <Form.Item
                  className="w-33"
                  name="reqType"
                  wrapperCol={{ span: 24 }}
                  initialValue="value"
                >
                  <Select allowClear>
                    <Option value="value">值</Option>
                    <Option value="client">转发自客户端</Option>
                    <Option value="path">环境变量</Option>
                  </Select>
                </Form.Item>
                <Form.Item className="w-235" name="reqHeadInfo" wrapperCol={{ span: 12 }}>
                  <Input placeholder="请输入..." />
                </Form.Item>
              </Space>

              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className="site-collapse-custom-collapse bg-light-50"
              >
                <Panel header="更多" key="1" className="site-collapse-custom-panel">
                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>是否内部:</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    valuePropName="checked"
                    initialValue={false}
                    name="isInner"
                    colon={false}
                    style={{ marginBottom: '20px' }}
                    rules={[{ required: true }]}
                  >
                    <Switch className={styles['switch-edit-btn']} size="small" />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div className="">
                        <span className={styles['label-style']}>自定义Float标量:</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    name="defineFloat"
                    colon={false}
                    style={{ marginBottom: '20px' }}
                  >
                    <Input placeholder="请输入..." />
                  </Form.Item>

                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>自定义INT标量:</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    name="defineInt"
                    colon={false}
                    required
                    style={{ marginBottom: '20px' }}
                  >
                    <Input placeholder="请输入..." />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>排除重命名根字段:</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    colon={false}
                    required
                    style={{ marginBottom: '20px' }}
                    name="exceptRename"
                  >
                    <Input placeholder="请输入..." />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Form>
          </div>
        </>
      )}
    </>
  )
}
