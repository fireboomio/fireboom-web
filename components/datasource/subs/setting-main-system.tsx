import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'

import styles from './authentication-main.module.scss'

export default function SettingMainSystem() {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <>
      <div className="flex">
        <div className={styles.setWord}>
          <span>配置重定向URL：</span>
        </div>
        <div className={`${styles.authSetFrom} mr-2`}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label={<span className={styles['label-style']}>域名1：</span>}
              name="firstDomainName"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={<span className={styles['label-style']}>域名2：</span>}
              name="secondDomainName"
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="dashed" style={{ width: '100%' }} icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
