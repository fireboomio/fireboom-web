import { RightOutlined, RightSquareOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { Button, Form, Switch, Descriptions, Input, Select, Radio, notification } from 'antd'
import type { NotificationPlacement } from 'antd/lib/notification'
import { useContext, ReactNode, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext, DatasourceDispatchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

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

const { Option } = Select
const initForm = (
  <Form.Item label="连接URL">
    <Input.Group compact>
      <Form.Item
        name={['url', 'typeName']}
        noStyle
        rules={[{ required: true, message: 'typeName is required' }]}
      >
        <Select className="w-1/4">
          <Option value="value">值</Option>
          <Option value="path">环境变量</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={['url', 'connectURL']}
        noStyle
        rules={[
          { required: true, message: '连接名不能为空' },
          {
            pattern: new RegExp('^\\w+$', 'g'),
            message: '只允许包含字母，数字，下划线',
          },
        ]}
      >
        <Input style={{ width: '75%' }} placeholder="请输入" />
      </Form.Item>
    </Input.Group>
  </Form.Item>
)
const paramForm = (
  <>
    <Form.Item
      label="主机:"
      name="host"
      rules={[
        { required: true, message: '主机名不能为空' },
        {
          pattern: new RegExp('^\\w+$', 'g'),
          message: '只允许包含字母，数字，下划线',
        },
      ]}
    >
      <Input placeholder="请输入..." />
    </Form.Item>
    <Form.Item
      label="数据库名:"
      name="DBName"
      rules={[
        { required: true, message: '数据库名不能为空' },
        {
          pattern: new RegExp('^\\w+$', 'g'),
          message: '只允许包含字母，数字，下划线',
        },
      ]}
    >
      <Input placeholder="请输入..." />
    </Form.Item>
    <Form.Item
      label="端口:"
      name="port"
      rules={[
        { required: true, message: '端口号不能为空' },
        {
          pattern: new RegExp('^\\w+$', 'g'),
          message: '只允许包含字母，数字，下划线',
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
          pattern: new RegExp('^\\w+$', 'g'),
          message: '只允许包含字母，数字，下划线',
        },
      ]}
    >
      <Input placeholder="请输入..." />
    </Form.Item>
    <Form.Item
      label="密码:"
      name="password"
      rules={[
        { required: true, message: '密码不能为空' },
        {
          pattern: new RegExp('^\\w+$', 'g'),
          message: '只允许包含字母，数字，下划线',
        },
      ]}
    >
      <Input.Password placeholder="请输入..." />
    </Form.Item>
  </>
)

export default function DatasourceDBMain({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [disabled, setDisabled] = useImmer(false)
  const [isSecretShow, setIsSecretShow] = useImmer(false)
  const [form] = Form.useForm()
  const [viewerForm, setViewerForm] = useImmer<React.ReactNode>(initForm)
  const config = JSON.parse(content.config) as Config

  //设置初始编辑部分初始化显示的表单
  useEffect(() => {
    setViewerForm(config.typeName == 'url' ? initForm : paramForm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])
  //查看页面逻辑
  if (!content) {
    return <></>
  }

  //是否开启数据源开关回调
  const connectSwitchOnChange = (isChecked: boolean) => {
    void requests
      .put('/dataSource', {
        ...content,
        switch: isChecked == true ? 1 : 0,
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
          dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 1) })
        })
      })
    console.log('switch change')
  }

  //编辑页面逻辑

  //表单提交成功回调
  const onFinish = async (values: FromValues) => {
    console.log('Success:', values)
    const newValues = { ...config, ...values }
    await requests.put('/dataSource', { ...content, config: JSON.stringify(newValues) })
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
      dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 1) })
    })
    handleToggleDesigner('data', content.id)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  //表单item值改变回调
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

  //测试连接 成功与失败提示
  const openNotification = (placement: NotificationPlacement) => {
    notification.open({
      message: <IconFont type="icon-xingzhuangjiehe" />,
      description: (
        <div>
          <h1>链接失败</h1>
          描述性语句描述性语句描述性语句
        </div>
      ),
      placement,
    })
  }

  //单选框链接URL和链接参数切换回调
  const typeChange = (value: string) => {
    setDisabled(true)
    switch (value) {
      case 'url':
        setViewerForm(initForm)
        break
      case 'param':
        setViewerForm(paramForm)
        break
      default:
        setViewerForm('')
        break
    }
  }
  return (
    <>
      {type === 'data' ? (
        //查看页面———————————————————————————————————————————————————————————————————————————————————
        //查看页面———————————————————————————————————————————————————————————————————————————————————
        <div>
          <div className="pb-9px flex items-center justify-between border-gray border-b ">
            <div>
              <IconFont type="icon-shujuyuantubiao1" />
              <span className="ml-2 text-[14px]">
                {content.name} <span className="text-[#AFB0B4] text-[12px]">main</span>
              </span>
            </div>
            <div className="flex justify-center items-center">
              <Switch
                checked={content.switch == 1 ? true : false}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className="ml-6 w-15"
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
                width: '25%',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item label="连接名">{config.connectName}</Descriptions.Item>
              <Descriptions.Item label="类型">{config.SQlType}</Descriptions.Item>
              <Descriptions.Item label="类型">{config.typeName}</Descriptions.Item>

              {config.typeName == 'param' ? (
                <>
                  <Descriptions.Item label="主机">{config.host}</Descriptions.Item>
                  <Descriptions.Item label="数据库名">{config.DBName}</Descriptions.Item>
                  <Descriptions.Item label="端口">{config.port}</Descriptions.Item>
                  <Descriptions.Item label="用户">{config.userName}</Descriptions.Item>
                  <Descriptions.Item label="密码">
                    {isSecretShow ? (
                      <span>
                        {config.password}
                        <IconFont
                          className="ml-2"
                          type="icon-xiaoyanjing-chakan"
                          onClick={() => {
                            setIsSecretShow(!isSecretShow)
                          }}
                        />
                      </span>
                    ) : (
                      <span>
                        **********
                        <IconFont
                          className="ml-2"
                          type="icon-xiaoyanjing-yincang"
                          onClick={() => {
                            setIsSecretShow(!isSecretShow)
                          }}
                        />
                      </span>
                    )}
                  </Descriptions.Item>
                </>
              ) : (
                <>
                  <Descriptions.Item label="环境变量">
                    {(config.url as unknown as { typeName: string; connectURL: string })?.typeName}
                  </Descriptions.Item>
                  <Descriptions.Item label="连接URL">
                    {
                      (config.url as unknown as { typeName: string; connectURL: string })
                        ?.connectURL
                    }
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </div>
        </div>
      ) : type === 'edit' ? (
        //编辑页面—————————————————————————————————————————————————————————————————————————————————————
        //编辑页面—————————————————————————————————————————————————————————————————————————————————————
        <div>
          <div className="pb-8px flex items-center justify-between border-gray border-b ">
            <div>
              <IconFont type="icon-shujuyuantubiao1" />
              <span className="ml-2">{content.name}</span>
              <span className="ml-2 text-xs text-gray-500/80">main</span>
            </div>
            <div className="flex justify-center items-centerw-160px">
              <Button
                className={`${styles['connect-check-btn-common']} w-16 ml-4`}
                onClick={() => {
                  handleToggleDesigner('data', content.id)
                }}
              >
                取消
              </Button>
              <Button
                disabled={disabled}
                className={`${styles['connect-check-btn']}  ml-4`}
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
              initialValues={{
                connectName: config.connectName,
                SQlType: config.SQlType,
                typeName: config.typeName,
                host: config.host,
                DBName: config.DBName,
                port: config.port,
                userName: config.userName,
                password: config.password,
                url: {
                  typeName: (config.url as unknown as { typeName: string; connectURL: string })
                    ?.typeName,
                  connectURL: (config.url as unknown as { typeName: string; connectURL: string })
                    ?.connectURL,
                },
              }}
            >
              <Form.Item
                label="连接名:"
                name="connectName"
                rules={[
                  { required: true, message: '连接名不能为空' },
                  {
                    pattern: new RegExp('^\\w+$', 'g'),
                    message: '只允许包含数字，字母，下划线',
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
                  <Radio value="url" style={{ marginRight: '50px' }}>
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
        //设置页面———————————————————————————————————————————————————————————————————————————————————
        //设置页面———————————————————————————————————————————————————————————————————————————————————
        <>
          <div className="flex">
            <Descriptions
              bordered
              layout="vertical"
              size="small"
              className="w-3/7 mr-20"
              labelStyle={{
                width: '30%',
              }}
            >
              <Descriptions.Item label="自定义类型">
                <Editor
                  height="90vh"
                  defaultLanguage="typescript"
                  defaultValue="// some comment"
                  className={`mt-4 ${styles.monaco}`}
                />
              </Descriptions.Item>
            </Descriptions>
            <Descriptions
              bordered
              layout="vertical"
              size="small"
              className="w-4/7"
              labelStyle={{
                width: '30%',
              }}
            >
              <Descriptions.Item label="字段类型映射">
                <div className="h-100">显示</div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      )}
    </>
  )
}
