import { Button, Form, Input, Switch } from 'antd'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './storage-main.module.scss'

interface Props {
  content: DatasourceItem
}
export default function StorageMainSet({ content }: Props) {
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  const onFinish = (values: object) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }
  const { info } = content
  return (
    <>
      <div className="flex items-center justify-between border-gray border-b">
        <div>
          <span className="ml-2">{info.leftHeadName}</span>
        </div>
        <div className="flex justify-center items-center mb-2">
          <Switch
            defaultChecked
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className={styles['switch-check-btn']}
          />
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
          labelAlign="left"
          className="ml-3"
        >
          <Form.Item label="名称" style={{ marginBottom: '20px' }}>
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务地址" style={{ marginBottom: '20px' }}>
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App ID" style={{ marginBottom: '20px' }} required>
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App Secret" style={{ marginBottom: '20px' }} required>
            <Input.Password placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="区域" style={{ marginBottom: '20px' }}>
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="bucketName" style={{ marginBottom: '49px' }}>
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="开启SSL" style={{ marginBottom: '20px' }} rules={[{ required: true }]}>
            <Switch defaultChecked className={styles['switch-edit-btn']} size="small" />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
