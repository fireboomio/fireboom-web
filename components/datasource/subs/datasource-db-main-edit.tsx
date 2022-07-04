import { RightSquareOutlined, AppleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Radio, notification } from 'antd'
import type { NotificationPlacement } from 'antd/lib/notification'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './datasource-db-main.module.scss'
interface FromValues {
  [key: string]: number | string | boolean
}
interface Props {
  content: DatasourceItem
}

const initForm = (
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

export default function DatasourceDBMainEdit({ content }: Props) {
  const [disabled, setDisabled] = useImmer(true)
  const [viewerForm, setViewerForm] = useImmer<React.ReactNode>(initForm)
  const onFinish = (values: object) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (changedValues: object, allValues: FromValues) => {
    console.log(allValues)
    for (const key in allValues) {
      if ((allValues[key] as string) == undefined || allValues[key] == '') {
        setDisabled(true)
        return
      }
    }
    setDisabled(false)
  }

  const openNotification = (placement: NotificationPlacement) => {
    notification.open({
      message: <CloseCircleOutlined />,
      description: (
        <div>
          <h1>链接失败</h1>
          描述性语句描述性语句描述性语句
        </div>
      ),
      placement,
    })
  }

  const typeChange = (value: string) => {
    setDisabled(true)
    switch (value) {
      case 'env':
        setViewerForm(initForm)
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
        <span className="ml-2">{content.name}</span>
        <span className="ml-2 text-xs text-gray-500/80">main</span>
      </div>

      <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          style={{ width: '70%' }}
          name="basic"
          wrapperCol={{ span: 12 }}
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
          >
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="类型:">
            <Select placeholder="请输入...">
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="类型:" wrapperCol={{ span: 15 }}>
            <Radio.Group
              defaultValue="env"
              onChange={(e) => {
                typeChange(e.target.value as string)
              }}
            >
              <Radio value="env" className="mr-15 ">
                环境变量
              </Radio>
              <Radio value="url" className="mr-15">
                连接URL
              </Radio>
              <Radio value="param"> 连接参数 </Radio>
            </Radio.Group>
          </Form.Item>
          {viewerForm}
          <Form.Item>
            <Button
              className={styles['connect-edit-btn']}
              onClick={() => openNotification('bottomLeft')}
            >
              <RightSquareOutlined />
              <span>测试链接</span>{' '}
            </Button>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 9, span: 5 }}
            style={{
              display: 'flex',
              width: '100%',
              position: 'absolute',
              top: '70px',
              right: '-68rem',
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
