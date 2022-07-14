import { QuestionCircleOutlined, CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Switch, Collapse, Upload, Checkbox } from 'antd'
import { useContext } from 'react'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context'

import styles from './datasource-common-main.module.scss'

interface Props {
  content: DatasourceResp
}

export default function DatasourceGraphalMainEdit({ content }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)

  const [form] = Form.useForm()
  const { Option } = Select
  const { Panel } = Collapse

  const onFinish = (values: object) => {
    handleToggleDesigner('data', content.id)
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="flex items-center justify-between border-gray border-b">
        <div>
          <span className="ml-2">
            {content.name} <span className="text-xs text-gray-500/80">GET</span>
          </span>
        </div>
        <div className="flex justify-center items-center mb-2">
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
          labelCol={{ span: 3 }}
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
          >
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            style={{ marginBottom: '20px' }}
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
          >
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<PlusOutlined />} className="w-147">
                添加文件
              </Button>
            </Upload>
          </Form.Item>
        </Form>
        <h2 className="ml-3 mb-3">请求头</h2>
        <Form className="flex mb-3">
          <Form.Item className="w-50 mr-2 ">
            <Input />
          </Form.Item>
          <Form.Item className="w-40">
            <Select allowClear>
              <Option defaultValue="way">值</Option>
              <Option value="head">转发自客户端</Option>
              <Option value="code">环境变量</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w-200">
            <Input placeholder="请输入..." />
          </Form.Item>
        </Form>
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse bg-light-50"
        >
          <Panel header="更多" key="1" className="site-collapse-custom-panel">
            <Form
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 11 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger="onBlur"
              labelAlign="left"
            >
              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>是否内部:</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                style={{ marginBottom: '20px' }}
                rules={[{ required: true }]}
              >
                <Switch defaultChecked className={styles['switch-edit-btn']} size="small" />
              </Form.Item>
              <Form.Item
                label={
                  <div className="">
                    <span className={styles['label-style']}>自定义Float标量:</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
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
              >
                <Input placeholder="请输入..." />
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </div>
    </>
  )
}
