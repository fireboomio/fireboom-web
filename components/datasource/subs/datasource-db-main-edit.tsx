import { RightSquareOutlined, AppleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Radio, Col, Row } from 'antd'
import { useImmer } from 'use-immer'

import styles from './datasource-db-main.module.scss'
interface FromValues {
  [key: string]: number | string | boolean
}
export default function DatasourceEditorMainEdit() {
  const [disabled, setDisabled] = useImmer(true)
  const [viewerForm, setViewerForm] = useImmer<React.ReactNode>(
    <Form.Item
      label="环境变量"
      name="environmentVar"
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
  )
  const onFinish = (values: object) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (changedValues: object, allValues: FromValues) => {
    for (const key in allValues) {
      if ((allValues[key] as string) == undefined || allValues[key] == '') {
        setDisabled(true)
        return
      }
    }
    setDisabled(false)
  }
  const typeChange = (value: string) => {
    switch (value) {
      case 'env':
        setViewerForm(
          <Form.Item
            label="环境变量"
            name="environmentVar"
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
        )
        break
      case 'url':
        setViewerForm(
          <Form.Item
            label="连接URL"
            name="connectURL"
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
        )
        break
      case 'param':
        setViewerForm(
          <>
            <Form.Item wrapperCol={{ span: 18 }}>
              <Row gutter={110}>
                <Col span={12}>
                  <Form.Item
                    label="主机:"
                    name="host"
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
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="数据库名:"
                    name="DBName"
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
                </Col>
              </Row>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 18 }}>
              <Row gutter={110}>
                <Col span={12}>
                  <Form.Item
                    label="端口:"
                    name="port"
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
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="用户:"
                    name="userName"
                    rules={[
                      { required: true, message: '用户名不能为空' },
                      {
                        pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                        message: '只允许包含字母',
                      },
                    ]}
                  >
                    <Input placeholder="请输入..." />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              label="密码:"
              name="password"
              rules={[
                { required: true, message: '连接名不能为空' },
                {
                  pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                  message: '只允许包含字母',
                },
              ]}
            >
              <Input.Password placeholder="请输入..." />
            </Form.Item>
          </>
        )
        break
      default:
        setViewerForm('')
        break
    }
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
          layout="vertical"
          name="basic"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
          autoComplete="off"
          validateTrigger="onBlur"
          className={styles['db-form']}
        >
          <Form.Item
            label="连接名:"
            name="connnectName"
            rules={[
              { required: true, message: '连接名不能为空' },
              {
                pattern: new RegExp('[a-z]|[A-Z]+', 'g'),
                message: '只允许包含字母',
              },
            ]}
            style={{ marginBottom: '24px' }}
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="类型:" style={{ marginBottom: '24px' }}>
            <Select placeholder="请输入...">
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px' }}>
            <span className="mr-2">类型 :</span>
            <Radio.Group
              defaultValue="env"
              onChange={(e) => {
                typeChange(e.target.value as string)
              }}
            >
              <Radio value="env" className="mr-9">
                环境变量
              </Radio>
              <Radio value="url" className="mr-9">
                连接URL
              </Radio>
              <Radio value="param"> 连接参数 </Radio>
            </Radio.Group>
          </Form.Item>

          {viewerForm}

          <Form.Item>
            <Button className={styles['connect-btn']}>
              <RightSquareOutlined />
              <span className={styles['connect-text']}>测试链接</span>{' '}
            </Button>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 9, span: 5 }}
            style={{
              display: 'flex',
              width: '100%',
              position: 'absolute',
              top: '70px',
              right: '-40rem',
            }}
          >
            <Button className={styles['cancel-btn']}>取消</Button>{' '}
            <Button disabled={disabled} className={styles['save-btn']} htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
