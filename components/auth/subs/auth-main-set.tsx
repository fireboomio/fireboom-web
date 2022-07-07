import { Button, Form, Input, Switch, Divider } from 'antd'

import type { AuthProvItem } from '@/interfaces/auth'

import styles from './auth-common-main.module.scss'

interface Props {
  content: AuthProvItem
}

export default function AuthMainSet({ content }: Props) {
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  const onFinish = (values: object) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }
  if (!content) {
    return <></>
  }
  return (
    <>
      <div className="pb-2 flex items-center justify-between border-gray border-b">
        <div>
          <span className="text-base leading-5 font-bold">设置</span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className={styles['switch-check-btn']}
          />
          <Divider type="vertical" />
          <Button className={styles['center-btn']}>
            <span>取消</span>
          </Button>
          <Button className={styles['save-btn']}>
            <span>保存</span>
          </Button>
        </div>
      </div>

      <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 11 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          labelAlign="left"
          className="ml-3"
        >
          <Form.Item label="名称">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务地址">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App ID" required>
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App Secret" required>
            <Input.Password placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="区域">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="bucketName">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="开启SSL" style={{ marginTop: '29px' }} rules={[{ required: true }]}>
            <Switch defaultChecked className={styles['switch-set-btn']} size="small" />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
