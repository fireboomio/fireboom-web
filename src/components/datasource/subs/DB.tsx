import { Button, Descriptions, Form, Input, Modal, notification, Radio, Select } from 'antd'
import type { NotificationPlacement } from 'antd/lib/notification'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import IconFont from '@/components/iconfont'
import type { DatasourceResp, ReplaceJSON, ShowType } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './DB.module.less'
import FileList from './FileList'
import Setting from './Setting'

interface Props {
  content: DatasourceResp
  type: ShowType
}

type Config = Record<string, string | any[]>

type FromValues = Record<string, number | string | boolean>

interface Props {
  content: DatasourceResp
}

interface OptionT {
  label: string
  value: string
}

const { Option } = Select

const port = /^(([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))$/
const domainReg = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/
const ipReg =
  /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/
// const envReg =
//   // eslint-disable-next-line no-useless-escape
//   /^jdbc:mysql:\/\/((25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)):(([1-9]([0-9]{0,3}))|([1-6][0-5][0-5][0-3][0-5]))\/([A-Za-z0-9_]+)(\?([\d\w\/=\?%\-&_~`@[\]\':+!]*))?$/
const passwordReg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/

const BASEPATH = '/static/upload/sqlite'

export default function DB({ content, type }: Props) {
  const navigate = useNavigate()
  const { handleToggleDesigner, handleSave } = useContext(DatasourceToggleContext)
  const [_disabled, setDisabled] = useImmer(false)
  const [isSecretShow, setIsSecretShow] = useImmer(false)
  const [form] = Form.useForm()
  const config = content.config as Config
  const [rulesObj, setRulesObj] = useImmer({})
  const [isValue, setIsValue] = useImmer(true)
  const [envOpts, setEnvOpts] = useImmer<OptionT[]>([])
  const [envVal, setEnvVal] = useImmer('')

  const [visible, setVisible] = useImmer(false)
  // const [uploadPath, setUploadPath] = useImmer(BASEPATH)

  const dbType = config.dbType

  const setUploadPath = (v: string) => {
    form.setFieldValue(['databaseUrl', 'val'], v)
    form.setFieldValue(['databaseUrl', 'kind'], '0')
  }

  // 表单选择后规则校验改变
  const onValueChange = (value: string) => {
    switch (value) {
      case '0':
        setIsValue(true)
        setRulesObj({ pattern: /^\w{1,128}$/g, message: '请输入长度不大于128的非空值' })
        form.setFieldValue(['databaseUrl', 'val'], '')
        return
      case '1':
        setIsValue(false)
        setEnvVal(envOpts.at(0)?.label ?? '')
        form.setFieldValue(['databaseUrl', 'val'], '')
        return
      default:
        setIsValue(false)
        return
    }
  }

  const onValue2Change = (value: string) => {
    setEnvVal(value)
  }

  useEffect(() => {
    void getFetcher('/env')
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      .then(envs => envs.filter(x => x.isDel === 0).map(x => ({ label: x.key, value: x.key })))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .then(x => setEnvOpts(x))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initForm =
    dbType === 'SQLite' ? (
      <Form.Item
        rules={[{ required: true, message: '请上传文件' }]}
        label={
          <>
            <span>路径</span>
            {/* <FormToolTip title="路径" /> */}
          </>
        }
        colon={false}
        name={['databaseUrl', 'val']}
        style={{ marginBottom: '20px' }}
      >
        <Input
          placeholder="请输入..."
          onClick={() => setVisible(true)}
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          suffix={<a onClick={() => setVisible(true)}>浏览</a>}
          readOnly
        />
      </Form.Item>
    ) : (
      <Form.Item label="连接URL">
        <Input.Group compact>
          <Form.Item name={['databaseUrl', 'kind']} noStyle>
            <Select className="w-1/5" onChange={onValueChange}>
              <Option value="0">值</Option>
              <Option value="1">环境变量</Option>
            </Select>
          </Form.Item>
          {isValue ? (
            <Form.Item name={['databaseUrl', 'val']} noStyle rules={[rulesObj]}>
              <Input style={{ width: '80%' }} placeholder="请输入" />
            </Form.Item>
          ) : (
            <Form.Item name={['databaseUrl', 'val']} noStyle rules={[rulesObj]}>
              <Select
                className="w-1/5"
                style={{ width: '80%' }}
                options={envOpts}
                value={envVal}
                onChange={onValue2Change}
              />
            </Form.Item>
          )}
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
          { pattern: domainReg || ipReg, message: '请填写规范域名或者ip' }
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
            pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_-]*$', 'g'),
            message: '以字母或下划线开头，只能由数字、字母、下划线组成'
          }
        ]}
      >
        <Input placeholder="请输入..." />
      </Form.Item>
      <Form.Item
        label="端口:"
        name="port"
        rules={[
          { required: true, message: '端口号不能为空' },
          { pattern: port, message: '端口范围为0-9999' }
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
            message: '以字母或下划线开头，只能由数字、字母、下划线组成'
          }
        ]}
      >
        <Input placeholder="请输入..." />
      </Form.Item>
      <Form.Item
        label="密码:"
        name="password"
        // rules={[
        //   { required: true, message: '密码不能为空' },
        //   { pattern: passwordReg, message: '请输入4-64位包含数字、字母的组合' }
        // ]}
      >
        <Input.Password placeholder="请输入..." />
      </Form.Item>
    </>
  )

  const [viewerForm, setViewerForm] = useImmer<React.ReactNode>(initForm)

  //设置初始编辑部分初始化显示的表单
  useEffect(() => {
    if (type === 'form') {
      form.resetFields()
    }
    setViewerForm(config.appendType == '1' ? paramForm : initForm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  // 连接URL，值和环境变量切换,对应选择框切换，重新渲染获取数据
  useEffect(() => {
    setViewerForm(initForm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValue])

  //查看页面逻辑
  if (!content) return <Error50x />

  //是否开启数据源开关回调
  const connectSwitchOnChange = (isChecked: boolean) => {
    void requests
      .put('/dataSource', {
        ...content,
        switch: isChecked == true ? 0 : 1
      })
      .then(() => {
        handleSave({
          ...content,
          switch: isChecked == true ? 0 : 1
        })
      })
  }

  //编辑页面逻辑

  //表单提交成功回调
  const onFinish = async (values: FromValues) => {
    const newValues = { ...config, ...values }
    if (newValues.databaseUrl === undefined) {
      newValues.databaseUrl = {}
    } else if (newValues.databaseUrl.kind === undefined) {
      newValues.databaseUrl.kind = '0'
    }
    let newContent: DatasourceResp
    if (content.name == '' || content.name.startsWith('example_')) {
      const req = { ...content, config: newValues, name: values.apiNamespace }
      Reflect.deleteProperty(req, 'id')
      const result = await requests.post<unknown, number>('/dataSource', req)
      content.id = result
      newContent = content
    } else {
      newContent = {
        ...content,
        config: newValues,
        name: values.apiNamespace
      } as DatasourceResp
      await requests.put('/dataSource', newContent)
    }
    handleSave(newContent)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  //表单item值改变回调
  const onValuesChange = (_allValues: FromValues) => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length)
    setDisabled(hasErrors)
  }

  //测试连接 成功与失败提示
  const testLink = (placement: NotificationPlacement) => {
    void requests
      .post('/checkDBConn', {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { sourceType: content.sourceType, config: config }
      })
      .then(x => {
        if (x.msg === '连接成功') {
          notification.open({
            message: <IconFont type="icon-bixu" />,
            description: <h1>连接成功</h1>,
            placement
          })
        } else {
          notification.open({
            message: <IconFont type="icon-xingzhuangjiehe" />,
            description: <h1>连接失败</h1>,
            placement
          })
        }
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

  const handleTest = () => {
    // TODO 测试接口
  }

  return (
    <>
      <Modal
        className={styles['modal']}
        title={null}
        footer={null}
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={920}
      >
        <FileList
          basePath={BASEPATH}
          setUploadPath={setUploadPath}
          setVisible={setVisible}
          upType={2}
        />
      </Modal>

      {/* { (() => { your code })() }  useFormWarning的解决方案
      在return外定义setPage函数，当切换编辑页面时，在函数中使用useForm 返回相应的html代码*/}
      {type === 'detail' ? (
        //查看页面———————————————————————————————————————————————————————————————————————————————————
        <div>
          <div className="py-10px flex justify-end">
            <div
              className="h-22px bg-[#F9F9F9] rounded-2px text-[#E92E5E] w-21 flex items-center justify-center cursor-pointer"
              onClick={() => handleToggleDesigner('setting', content.id)}
            >
              更多设置
            </div>
          </div>
          <div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="连接名">{config.apiNamespace}</Descriptions.Item>
              <Descriptions.Item label="数据库类型">{config.dbType}</Descriptions.Item>
              {dbType === 'SQLite' ? (
                <Descriptions.Item label="路径">{config.databaseUrl?.val ?? ''}</Descriptions.Item>
              ) : (
                <>
                  {dbType === 'MongoDB' ? (
                    <></>
                  ) : (
                    <Descriptions.Item label="连接类型">
                      {config.appendType == '0'
                        ? '连接URL'
                        : config.appendType == '1'
                        ? '连接参数'
                        : ''}
                    </Descriptions.Item>
                  )}

                  {config.appendType == '1' ? (
                    <>
                      <Descriptions.Item label="主机">{config.host}</Descriptions.Item>
                      <Descriptions.Item label="端口">{config.port}</Descriptions.Item>
                      <Descriptions.Item label="数据库名">{config.dbName}</Descriptions.Item>
                      <Descriptions.Item label="用户">{config.userName}</Descriptions.Item>
                      <Descriptions.Item label="密码">
                        {isSecretShow ? (
                          <span>
                            {config.password}
                            <IconFont
                              className="ml-2"
                              type="icon-xiaoyanjing-chakan"
                              onClick={() => setIsSecretShow(!isSecretShow)}
                            />
                          </span>
                        ) : (
                          <span>
                            **********
                            <IconFont
                              className="ml-2"
                              type="icon-xiaoyanjing-yincang"
                              onClick={() => setIsSecretShow(!isSecretShow)}
                            />
                          </span>
                        )}
                      </Descriptions.Item>
                    </>
                  ) : (
                    <>
                      <Descriptions.Item label="连接URL">
                        {(config.databaseUrl as unknown as { kind: string; val: string })?.val}
                      </Descriptions.Item>
                    </>
                  )}
                </>
              )}
            </Descriptions>
          </div>
        </div>
      ) : type === 'form' ? (
        //编辑页面—————————————————————————————————————————————————————————————————————————————————————
        <div>
          <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
            <Form
              form={form}
              style={{ width: '90%' }}
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 12 }}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              onFinish={values => void onFinish(values)}
              onFinishFailed={onFinishFailed}
              onValuesChange={onValuesChange}
              validateTrigger={['onBlur', 'onChange']}
              autoComplete="new-password"
              labelAlign="right"
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
                  val: (config.databaseUrl as unknown as { kind: string; val: string })?.val
                }
              }}
            >
              <Form.Item
                label="名称:"
                name="apiNamespace"
                rules={[
                  { required: true, message: '名称不能为空' },
                  {
                    pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
                    message: '以字母或下划线开头，只能由数字、字母、下划线组成'
                  }
                ]}
              >
                <Input placeholder="请输入..." autoComplete="off" autoFocus={true} />
              </Form.Item>

              {/* <Form.Item
                label="类型:"
                name="dbType"
                // rules={[{ required: true, message: '类型不能为空' }]}
              >
                <Select placeholder="请输入..." defaultValue="MySQL">
                  <Select.Option value="MySQL">MySql</Select.Option>
                  <Select.Option value="SQLITE">SQLITE</Select.Option>
                  <Select.Option value="PGSQL">PGSQL</Select.Option>
                  <Select.Option value="MONGODB">MONGODB</Select.Option>
                </Select>
              </Form.Item> */}

              {dbType === 'SQLite' || dbType === 'MongoDB' ? (
                <></>
              ) : (
                <Form.Item label="连接类型:" name="appendType">
                  <Radio.Group onChange={e => typeChange(e.target.value as string)}>
                    <Radio value="0" style={{ marginRight: '50px' }}>
                      连接URL
                    </Radio>
                    <Radio value="1"> 连接参数 </Radio>
                  </Radio.Group>
                </Form.Item>
              )}
              {viewerForm}
              <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button
                  className="btn-cancel"
                  onClick={() => {
                    if (content.name) {
                      handleToggleDesigner('detail', content.id, content.sourceType)
                    } else {
                      navigate('/workbench/dataSource/new')
                    }
                  }}
                >
                  <span>取消</span>
                </Button>
                <Button className="btn-test ml-4" onClick={() => testLink('bottomLeft')}>
                  测试
                </Button>
                <Button
                  className="btn-save ml-4"
                  onClick={() => {
                    form.submit()
                  }}
                >
                  保存
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        //设置页面———————————————————————————————————————————————————————————————————————————————————
        <Setting
          content={content}
          initSchema={config.schemaExtension as string}
          replaceJSON={config.replaceJSONTypeFieldConfiguration as ReplaceJSON[]}
        />
      )}
    </>
  )
}
