import { RightSquareOutlined, AppleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Radio } from 'antd'

import styles from './datasource-editor-main.module.scss'

export default function DatasourceEditorMainEdit() {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="border-gray border-b pb-5">
        <AppleOutlined />
        <span className="ml-2">default_db</span>
        <span className="ml-2 text-xs text-gray-500/80">main</span>
      </div>

      <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 11 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
        >
          <Form.Item
            label="连接名"
            name="connnectName"
            rules={[
              { required: true, message: '连接名不能为空' },
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="类型" style={{ marginBottom: '10px' }}>
            <Select placeholder="请输入...">
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="类型" style={{ marginBottom: '10px' }}>
            <Radio.Group defaultValue="apple">
              <Radio value="apple"> 环境变量 </Radio>
              <Radio value="pear"> 连接URL </Radio>
              <Radio value="parma"> 连接参数 </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="环境变量"
            name="environmentVar"
            rules={[
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item
            label="连接URL"
            name="connectURL"
            rules={[
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item
            label="主机"
            name="host"
            rules={[
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item
            label="数据库名"
            name="DBName"
            rules={[
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item
            label="端口"
            name="port"
            rules={[
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item
            label="用户"
            name="userName"
            rules={[
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
          >
            <Input.Password placeholder="请输入..." />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 16 }} style={{ marginTop: '25px' }}>
            <Button className={styles['connect-btn']}>
              <RightSquareOutlined />
              <span className={styles['connect-text']}>测试链接</span>{' '}
            </Button>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 9, span: 16 }}
            style={{ display: 'flex', width: '100%', position: 'absolute', bottom: '20px' }}
          >
            <Button className={styles['cancel-btn']}>取消</Button>{' '}
            <Button className={styles['save-btn']} htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
