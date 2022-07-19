import {
  AppleOutlined,
  RightOutlined,
  RightSquareOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { Button, Form, Switch, Descriptions, Input, Select, Radio, notification } from 'antd'
import type { NotificationPlacement } from 'antd/lib/notification'
import axios from 'axios'
import { useContext, ReactNode } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext, DatasourceDispatchContext } from '@/lib/context'

import styles from './datasource-db.module.scss'
interface Props {
  content: DatasourceResp
  type: string
}

interface Config {
  [key: string]: ReactNode
}
interface FromValues {
  [key: string]: number | string | boolean
}

interface Props {
  content: DatasourceResp
}

interface Response {
  status: number
  data: { result: DatasourceResp[]; [key: string]: number | string | boolean | object }
  [key: string]: number | string | boolean | object
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

export default function DatasourceDBMain({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [disabled, setDisabled] = useImmer(true)
  const [form] = Form.useForm()
  const [viewerForm, setViewerForm] = useImmer<React.ReactNode>(initForm)

  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const onFinish = async (values: object) => {
    console.log('Success:', values)
    await axios.put('/api/v1/dataSource', { ...content, config: JSON.stringify(values) })
    const datasource: Response = await axios.get('/api/v1/dataSource')
    dispatch({
      type: 'fetched',
      data: datasource.data.result.filter((item) => item.source_type == 1),
    })
    handleToggleDesigner('data', content.id)
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
  const config = JSON.parse(content.config) as Config

  return (
    <>
      {type === 'data' ? (
        <div>
          <div className="pb-9px flex items-center justify-between border-gray border-b ">
            <div>
              <AppleOutlined />
              <span className="ml-2 text-[14px]">
                {content.name} <span className="text-[#AFB0B4] text-[12px]">main</span>
              </span>
            </div>
            <div className="flex justify-center items-center">
              <Switch
                defaultChecked={content.switch == 0 ? false : true}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className="ml-6 w-15 bg-[#8ABE2A]"
              />
              <Button className={`${styles['connect-check-btn-common']} w-20 ml-12`}>
                <span>测试链接</span>
              </Button>
              <Button className={`${styles['connect-check-btn-common']} w-16 ml-4`}>
                <span>设计</span>
              </Button>
              <Button
                className={`${styles['connect-check-btn']}  ml-4`}
                onClick={() => {
                  handleToggleDesigner('edit', content.id)
                }}
              >
                <span>编辑</span>
              </Button>
            </div>
          </div>
          <div
            className={`${styles['db-check-setting']} float-right mt-2 cursor-pointer`}
            onClick={() => {
              handleToggleDesigner('Setting', content.id)
            }}
          >
            <span className="w-14 h-5">更多设置</span> <RightOutlined />
          </div>
          <div className={`mt-8 ${styles['des-contain']}`}>
            <Descriptions
              bordered
              column={1}
              size="small"
              labelStyle={{
                paddingLeft: '24px',
                color: '#5F6269',
                backgroundColor: 'white',
                width: '30%',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item label="连接名">{config.connectName}</Descriptions.Item>
              <Descriptions.Item label="类型">{config.SQlType}</Descriptions.Item>
              <Descriptions.Item label="类型">{config.typeName}</Descriptions.Item>
              <Descriptions.Item label="环境变量">{config.environmentVar}</Descriptions.Item>
              <Descriptions.Item label="连接URL">{config.connectURL}</Descriptions.Item>
              <Descriptions.Item label="主机">{config.host}</Descriptions.Item>
              <Descriptions.Item label="数据库名">{config.DBName}</Descriptions.Item>
              <Descriptions.Item label="端口">{config.port}</Descriptions.Item>
              <Descriptions.Item label="用户">{config.userName}</Descriptions.Item>
              <Descriptions.Item label="密码">{config.password}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      ) : type === 'edit' ? (
        <div>
          <div className="pb-8px flex items-center justify-between border-gray border-b ">
            <div>
              <AppleOutlined />
              <span className="ml-2">{content.name}</span>
              <span className="ml-2 text-xs text-gray-500/80">main</span>
            </div>
            <div className="flex justify-center items-center">
              <Button className={styles['cancel-btn']}>取消</Button>
              <Button
                disabled={disabled}
                className={styles['save-btn']}
                onClick={() => {
                  form.submit()
                }}
              >
                保存
              </Button>
            </div>
          </div>

          <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
            <Form
              form={form}
              style={{ width: '90%' }}
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 12 }}
              onFinish={(values) => {
                void onFinish(values)
              }}
              onFinishFailed={onFinishFailed}
              onValuesChange={onValuesChange}
              autoComplete="off"
              validateTrigger="onBlur"
              className={styles['db-form']}
              labelAlign="left"
              initialValues={{ typeName: 'env' }}
            >
              <Form.Item
                label="连接名:"
                name="connectName"
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

              <Form.Item label="类型:" name="SQlType">
                <Select placeholder="请输入...">
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="类型:" name="typeName">
                <Radio.Group
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
                  <span>测试链接</span>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <>
          <div className="flex">
            <Descriptions
              bordered
              layout="vertical"
              size="small"
              className="w-2/5 mr-20"
              labelStyle={{
                width: '30%',
              }}
            >
              <Descriptions.Item label="自定义类型">
                <div className="h-100">编辑器</div>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions
              bordered
              layout="vertical"
              size="small"
              className="w-3/5"
              labelStyle={{
                width: '30%',
              }}
            >
              <Descriptions.Item label="字段类型映射">
                <div className="h-100">编辑器</div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      )}
    </>
  )
}
