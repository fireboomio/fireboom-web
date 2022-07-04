import { QuestionCircleOutlined, CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import { Button, Form, Input, Select, Radio, Switch, Tabs, Collapse, Upload, Checkbox } from 'antd'

import styles from './datasource-common-main.module.scss'

export default function DatasourceEditorMainEdit() {
  const onFinish = (values: object) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }
  const onChangeTab = (key: string) => {
    console.log(key)
  }
  const onChangeRadio = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
  }
  const { TabPane } = Tabs
  const { Option } = Select
  const { Panel } = Collapse
  return (
    <>
      <div className="flex items-center justify-between border-gray border-b">
        <div>
          <span className="ml-2">
            userinfo <span className="text-xs text-gray-500/80">GET</span>
          </span>
        </div>
        <div className="flex justify-center items-center mb-2">
          <Button className={styles['design-btn']}>
            <span>取消</span>
          </Button>
          <Button className={styles['edit-btn']}>
            <span>保存</span>
          </Button>
        </div>
      </div>

      <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 8 }}
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
              <Button icon={<PlusOutlined />} className="w-140">
                添加文件
              </Button>
            </Upload>
          </Form.Item>
        </Form>
        <Tabs defaultActiveKey="1" onChange={onChangeTab} className="ml-3">
          <TabPane tab="请求头" key="1">
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
          </TabPane>
          <TabPane
            tab={
              <div>
                <span>授权</span>
                <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
              </div>
            }
            key="2"
          >
            <Form
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 8 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger="onBlur"
              labelAlign="left"
            >
              <Form.Item label="JWT获取">
                <Radio.Group onChange={onChangeRadio}>
                  <Radio value={1} defaultChecked={true} className="mr-20">
                    静态
                  </Radio>
                  <Radio value={2}>动态</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="密钥" required>
                <Input.Group compact>
                  <Form.Item noStyle rules={[{ required: true }]}>
                    <Select style={{ width: '20%' }} placeholder="值">
                      1
                    </Select>
                  </Form.Item>
                  <Form.Item noStyle rules={[{ required: true }]}>
                    <Input style={{ width: '80%' }} placeholder="请输入..." />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              <Form.Item label="签名方法">
                <Radio value={1}>HS256</Radio>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
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
              wrapperCol={{ span: 8 }}
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
                    <span className={styles['label-style']}>排除重命名根字段：</span>
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
