import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Form, Input, Switch, Button } from 'antd'

import styles from './setting-main.module.scss'

export default function SettingMainSecurity() {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  return (
    <>
      <div>
        <div className="flex">
          <span className="mr-10">GraphQL端点：</span>
          <Switch
            defaultChecked
            className={styles['switch-edit-btn']}
            size="small"
            onChange={connectSwitchOnChange}
          />
          <span className={styles.setTitle}>
            <InfoCircleOutlined />
            https://loacalhost:999
          </span>
        </div>
        <div className="flex mt-8">
          <span className="mr-20">允许域名：</span>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            className={`${styles.authSetFrom} mr-2`}
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
                新增域名
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
