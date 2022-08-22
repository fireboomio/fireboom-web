import { RightOutlined, RightSquareOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { Button, Form, Switch, Descriptions, Input, Select, Radio, notification, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { NotificationPlacement } from 'antd/lib/notification'
import { useContext, ReactNode, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext, DatasourceDispatchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './DB.module.scss'
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
interface DataType {
  key: string
  table: string
  field: string
  resType: string
  inputType: string
  isOpen: boolean
}

const columns: ColumnsType<DataType> = [
  {
    title: '表',
    dataIndex: 'table',
    key: 'table',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="table">table</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '字段',
    dataIndex: 'field',
    key: 'field',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="jack">Jack</Option>
        <Option value="table">table</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '响应类型',
    dataIndex: 'resType',
    key: 'resType',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="table">table</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '输入类型',
    key: 'inputType',
    dataIndex: 'inputType',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="table">table</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '是否开启',
    key: 'isOpen',
    render: () => <Switch className="w-8 h-2" />,
  },
]
const data: DataType[] = [
  {
    key: '1',
    table: 'John Brown',
    field: '123',
    resType: 'New York No. 1 ',
    inputType: '222',
    isOpen: true,
  },
  {
    key: '2',
    table: 'John Brown',
    field: '123',
    resType: 'New York No. 1 ',
    inputType: '222',
    isOpen: false,
  },
]
const { Option } = Select
const port = /^(([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))$/
const domainReg = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/
const ipReg =
  /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/
const envReg =
  // eslint-disable-next-line no-useless-escape
  /^jdbc:mysql:\/\/((25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)):(([1-9]([0-9]{0,3}))|([1-6][0-5][0-5][0-3][0-5]))\/([A-Za-z0-9_]+)(\?([\d\w\/=\?%\-&_~`@[\]\':+!]*))?$/
const passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/

const initForm = (
  <Form.Item label="连接URL">
    <Input.Group compact>
      <Form.Item
        name={['databaseUrl', 'kind']}
        noStyle
        rules={[{ required: true, message: '类型不能为空' }]}
      >
        <Select className="w-1/5">
          <Option value="0">值</Option>
          <Option value="1">环境变量</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={['databaseUrl', 'val']}
        noStyle
        rules={[{ pattern: envReg, message: '请输入正确的格式' }]}
      >
        <Input style={{ width: '80%' }} placeholder="请输入" />
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
          pattern: domainReg || ipReg,
          message: '请填写规范域名或者ip',
        },
      ]}
    >
      <Input placeholder="请输入..." />
    </Form.Item>
    <Form.Item
      label="数据库名:"
      name="dbName"
      rules={[
        { required: true, message: '数据库名不能为空' },
        {
          pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
          message: '数据库名只有由数字、字母、下划线组成',
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
          pattern: port,
          message: '端口范围为0-9999',
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
          pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
          message: '用户名只有由数字、字母、下划线组成',
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
          pattern: passwordReg,
          message: '请输入4-64位包含数字、字母和非中文字符的组合',
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
  const config = content.config as Config

  //设置初始编辑部分初始化显示的表单
  useEffect(() => {
    form.resetFields()
    setViewerForm(config.appendType == '1' ? paramForm : initForm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])
  //查看页面逻辑
  if (!content) {
    return <></>
  }

  //是否开启数据源开关回调
  const connectSwitchOnChange = (isChecked: boolean) => {
    void requests
      .put('/dataSource', {
        ...content,
        switch: isChecked == true ? 0 : 1,
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
          dispatch({ type: 'fetched', data: res })
        })
      })
    console.log('switch change')
  }

  //编辑页面逻辑

  //表单提交成功回调
  const onFinish = async (values: FromValues) => {
    console.log('Success:', values)
    const newValues = { ...config, ...values }
    if (content.name == '') {
      const req = { ...content, config: newValues, name: values.apiNamespace }
      Reflect.deleteProperty(req, 'id')
      const result = await requests.post<unknown, number>('/dataSource', req)
      content.id = result
    } else {
      await requests.put('/dataSource', {
        ...content,
        config: newValues,
        name: values.apiNamespace,
      })
    }
    void requests
      .get<unknown, DatasourceResp[]>('/dataSource')
      .then(res => {
        dispatch({ type: 'fetched', data: res })
      })
      .then(() => {
        handleToggleDesigner('data', content.id)
      })
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  //表单item值改变回调
  const onValuesChange = (changedValues: object, allValues: FromValues) => {
    console.log(allValues, 'allValues')
    for (const key in allValues) {
      if ((allValues[key] as string) == undefined) {
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
    switch (value) {
      case '0':
        setViewerForm(initForm)
        break
      case '1':
        setViewerForm(paramForm)
        break
      default:
        setViewerForm('')
        break
    }
  }

  return (
    <>
      {/* { (() => { your code })() }  useFormWarning的解决方案
      在return外定义setPage函数，当切换编辑页面时，在函数中使用useForm 返回相应的html代码*/}
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
            <div className="flex  items-center">
              <Switch
                checked={content.switch == 0 ? true : false}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className="mr-10 w-15"
                style={{ marginRight: '30px' }}
              />
              <Button className={`${styles['connect-check-btn-common']} w-20`}>
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
              <Descriptions.Item label="连接名">{config.apiNamespace}</Descriptions.Item>
              <Descriptions.Item label="类型">{config.dbType}</Descriptions.Item>
              <Descriptions.Item label="类型">
                {config.appendType == '0' ? '连接URL' : config.appendType == '1' ? '连接参数' : ''}
              </Descriptions.Item>

              {config.appendType == '1' ? (
                <>
                  <Descriptions.Item label="主机">{config.host}</Descriptions.Item>
                  <Descriptions.Item label="数据库名">{config.dbName}</Descriptions.Item>
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
                    {(config.databaseUrl as unknown as { kind: string; val: string })?.kind == '0'
                      ? '值'
                      : (config.databaseUrl as unknown as { kind: string; val: string })?.kind ==
                        '1'
                      ? '环境变量'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item label="连接URL">
                    {(config.databaseUrl as unknown as { kind: string; val: string })?.val}
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
            {content.name == '' ? (
              <div>
                <IconFont type="icon-shujuyuantubiao1" />
                <span className="ml-3">创建数据源</span>
              </div>
            ) : (
              <div>
                <IconFont type="icon-shujuyuantubiao1" />
                <span className="ml-2">{content.name}</span>
                <span className="ml-2 text-xs text-gray-500/80">main</span>
              </div>
            )}

            <div className="flex  items-center justify-end w-36">
              <Button
                className={`${styles['connect-check-btn-common']} w-16 mr-4`}
                onClick={() => {
                  handleToggleDesigner('data', content.id, content.sourceType)
                }}
              >
                取消
              </Button>

              <Button
                disabled={disabled}
                className={`${styles['connect-check-btn']}`}
                onClick={() => {
                  form.submit()
                }}
              >
                {content.name == '' ? '创建' : '保存'}
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
              onFinish={values => {
                void onFinish(values)
              }}
              onFinishFailed={onFinishFailed}
              onValuesChange={onValuesChange}
              validateTrigger={['onBlur', 'onChange']}
              autoComplete="new-password"
              labelAlign="left"
              initialValues={{
                apiNamespace: config.apiNamespace,
                dbType: config.dbType,
                appendType: config.appendType || '0',
                host: config.host,
                dbName: config.dbName,
                port: config.port,
                userName: config.userName,
                password: config.password,
                databaseUrl: {
                  kind:
                    (config.databaseUrl as unknown as { kind: string; val: string })?.kind || '0',
                  val: (config.databaseUrl as unknown as { kind: string; val: string })?.val,
                },
              }}
            >
              <Form.Item
                label="名称:"
                name="apiNamespace"
                rules={[
                  { required: true, message: '连接名不能为空' },
                  {
                    pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
                    message: '连接名只有由数字、字母、下划线组成',
                  },
                ]}
              >
                <Input placeholder="请输入..." autoComplete="off" autoFocus={true} />
              </Form.Item>

<<<<<<< HEAD
              <Form.Item
                label="类型:"
                name="dbType"
                rules={[{ required: true, message: '类型不能为空' }]}
              >
                <Select placeholder="请输入..." defaultValue="MySQL">
                  <Select.Option value="MySQL">MySql</Select.Option>
=======
              <Form.Item label="类型:" name="dbType">
                <Select placeholder="请输入...">
                  <Select.Option value="MySQL" defaultValue="MySQL">
                    MySql
                  </Select.Option>
>>>>>>> e35b74e (数据源页面增加表单校验规则)
                  <Select.Option value="SQLITE">SQLITE</Select.Option>
                  <Select.Option value="PGSQL">PGSQL</Select.Option>
                  <Select.Option value="MONGODB">MONGODB</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="类型:" name="appendType">
                <Radio.Group
                  onChange={e => {
                    typeChange(e.target.value as string)
                  }}
                >
                  <Radio value="0" style={{ marginRight: '50px' }}>
                    连接URL
                  </Radio>
                  <Radio value="1"> 连接参数 </Radio>
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
              className="w-3/8 mr-10"
              labelStyle={{
                width: '30%',
              }}
            >
              <Descriptions.Item label="自定义类型" contentStyle={{ padding: '0' }}>
                <Editor
                  height="90vh"
                  defaultLanguage="typescript"
                  defaultValue="// some comment"
                  className={`${styles.monaco}`}
                />
              </Descriptions.Item>
            </Descriptions>
            <Descriptions
              bordered
              layout="vertical"
              size="small"
              className="w-5/8"
              labelStyle={{
                width: '30%',
              }}
            >
              <Descriptions.Item label="字段类型映射" contentStyle={{ padding: '0' }}>
                <div className={`${styles['db-setting-table']}`}>
                  <Table columns={columns} dataSource={data} pagination={false} />
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      )}
    </>
  )
}
