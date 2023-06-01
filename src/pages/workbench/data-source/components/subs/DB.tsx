import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { App, Button, Descriptions, Form, Input, message, Modal, Radio, Select, Upload } from 'antd'
import type { Rule } from 'antd/es/form'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import type { InputOrFromEnvProps } from '@/components/InputOrFromEnv'
import InputOrFromEnv, { Mode } from '@/components/InputOrFromEnv'
import { useValidate } from '@/hooks/validate'
import type { DatasourceResp, ReplaceJSON, ShowType } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import requests, { getFetcher } from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import useEnvOptions from '@/lib/hooks/useEnvOptions'
import { parseDBUrl } from '@/utils/db'
import uploadLocal from '@/utils/uploadLocal'

import styles from './DB.module.less'
import FileList from './FileList'
import Setting from './Setting'

interface Props {
  content: DatasourceResp
  type: ShowType
}

type Config = Record<string, any>

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
  const intl = useIntl()
  const { ruleMap } = useValidate()
  const navigate = useNavigate()
  const { handleToggleDesigner, handleSave } = useContext(DatasourceToggleContext)
  const [_disabled, setDisabled] = useImmer(false)
  const [isSecretShow, setIsSecretShow] = useImmer(false)
  const [form] = Form.useForm()
  const userNameKind = Form.useWatch(['userName', 'kind'], form)
  const passwordKind = Form.useWatch(['password', 'kind'], form)
  const appendType = Form.useWatch('appendType', form)

  const config = content.config as Config

  const [visible, setVisible] = useImmer(false)
  // const [uploadPath, setUploadPath] = useImmer(BASEPATH)
  const envOptions = useEnvOptions()

  const dbType = config.dbType

  const setUploadPath = (v: string) => {
    form.setFieldValue(['databaseUrl', 'val'], v)
    form.setFieldValue(['databaseUrl', 'kind'], '0')
    form.validateFields()
  }

  const onUrlChange: InputOrFromEnvProps['onChange'] = data => {
    form.validateFields()
    form.setFieldValue('databaseUrl', data)
  }

  const dbProtocol = String(content?.config.dbType).toLowerCase()

  const sqlLiteInputValue = useRef('')
  const { modal } = App.useApp()
  const onCreateSqlite = async () => {
    sqlLiteInputValue.current = ''
    const _modal = modal.confirm({
      title: intl.formatMessage({ defaultMessage: '请输入名称' }),
      content: (
        <Input
          autoFocus
          placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
          onChange={e => {
            sqlLiteInputValue.current = e.target.value
          }}
        />
      ),
      footer: (
        <div className="flex mt-2 justify-end common-form">
          <Button
            className="btn-cancel"
            onClick={() => {
              _modal.destroy()
            }}
          >
            <span>{intl.formatMessage({ defaultMessage: '取消' })}</span>
          </Button>
          <Button
            className="ml-4 btn-save"
            onClick={async () => {
              const dbName = sqlLiteInputValue.current.trim().replace(/\.db$/, '').trim()
              if (!dbName) {
                message.error(intl.formatMessage({ defaultMessage: '请输入名称' }))
                return
              }
              const hide = message.loading(intl.formatMessage({ defaultMessage: '上传中' }))
              try {
                try {
                  await uploadLocal('2', '', dbName + '.db')
                } catch (e: any) {
                  const msgMap: any = {
                    10440011: intl.formatMessage({ defaultMessage: '文件名已存在' })
                  }
                  const msg = msgMap[e?.response?.data?.code]
                  message.error(msg || intl.formatMessage({ defaultMessage: '上传失败' }))
                  return
                }
                setUploadPath(dbName + '.db')
                _modal.destroy()
              } finally {
                hide()
              }
            }}
          >
            {intl.formatMessage({ defaultMessage: '确定' })}
          </Button>
        </div>
      )
    })
  }

  const initForm =
    dbType === 'SQLite' ? (
      <Form.Item
        rules={[{ required: true, message: intl.formatMessage({ defaultMessage: '请上传文件' }) }]}
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
        <div className="flex">
          <Form.Item name={['databaseUrl', 'val']} noStyle>
            <Input
              placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
              onClick={() => setVisible(true)}
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              suffix={<a onClick={() => setVisible(true)}>浏览</a>}
              readOnly
            />
          </Form.Item>
          <Button className="ml-4 text-[#f5587a]" onClick={onCreateSqlite}>
            {intl.formatMessage({ defaultMessage: '创建空数据库' })}
          </Button>
        </div>
      </Form.Item>
    ) : (
      <InputOrFromEnv
        formItemProps={{
          label: intl.formatMessage({ defaultMessage: '连接URL' }),
          name: 'databaseUrl'
        }}
        inputProps={{
          placeholder: intl.formatMessage(
            { defaultMessage: '示例: {dbProtocol}://user:password@localhost:3306/db-name' },
            { dbProtocol: dbProtocol }
          )
        }}
        envProps={{
          placeholder: intl.formatMessage({ defaultMessage: '请选择一个环境变量或者手动输入' })
        }}
        // rules={urlRule ? [urlRule] : []}
        rules={
          dbProtocol
            ? [
                {
                  required: true,
                  validator(rule, value, callback) {
                    const reg = new RegExp(`^${dbProtocol}://.{1,${125 - dbProtocol.length}}$`)
                    if (value.val.match(reg)?.length) {
                      callback()
                    } else {
                      callback(
                        intl.formatMessage(
                          { defaultMessage: '以 {dbProtocol}:// 开头，不超过128位' },
                          { dbProtocol }
                        )
                      )
                    }
                  }
                }
              ]
            : []
        }
        onChange={onUrlChange}
      />
    )

  const paramForm = (
    <>
      <Form.Item
        label={intl.formatMessage({ defaultMessage: '主机:' })}
        name="host"
        rules={[
          { required: true, message: intl.formatMessage({ defaultMessage: '主机名不能为空' }) }
        ]}
      >
        <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ defaultMessage: '数据库名:' })}
        name="dbName"
        rules={[
          { required: true, message: intl.formatMessage({ defaultMessage: '数据库名不能为空' }) },
          {
            pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_-]*$', 'g'),
            message: intl.formatMessage({
              defaultMessage: '以字母或下划线开头，只能由数字、字母、下划线组成'
            })
          }
        ]}
      >
        <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ defaultMessage: '端口:' })}
        name="port"
        rules={[
          { required: true, message: intl.formatMessage({ defaultMessage: '端口号不能为空' }) },
          { pattern: port, message: intl.formatMessage({ defaultMessage: '端口范围为0-9999' }) }
        ]}
      >
        <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
      </Form.Item>

      <Form.Item label={intl.formatMessage({ defaultMessage: '用户:' })} required>
        <Input.Group compact className="!flex">
          {/*<Form.Item name={['userName', 'kind']} noStyle>*/}
          {/*  <Select className="flex-0 w-100px">*/}
          {/*    <Select.Option value="0">*/}
          {/*      {intl.formatMessage({ defaultMessage: '值' })}*/}
          {/*    </Select.Option>*/}
          {/*    <Select.Option value="1">*/}
          {/*      {intl.formatMessage({ defaultMessage: '环境变量' })}*/}
          {/*    </Select.Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          <Form.Item
            name={['userName', 'val']}
            noStyle
            rules={[
              { required: true, message: intl.formatMessage({ defaultMessage: '用户名不能为空' }) },
              {
                pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
                message: intl.formatMessage({
                  defaultMessage: '以字母或下划线开头，只能由数字、字母、下划线组成'
                })
              }
            ]}
          >
            {String(userNameKind) !== '1' ? (
              <Input
                className="flex-1"
                placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
              />
            ) : (
              <Select className="flex-1" options={envOptions} />
            )}
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item label={intl.formatMessage({ defaultMessage: '密码:' })}>
        <Input.Group compact className="!flex">
          {/*<Form.Item name={['password', 'kind']} noStyle>*/}
          {/*  <Select className="flex-0 w-100px">*/}
          {/*    <Select.Option value="0">*/}
          {/*      {intl.formatMessage({ defaultMessage: '值' })}*/}
          {/*    </Select.Option>*/}
          {/*    <Select.Option value="1">*/}
          {/*      {intl.formatMessage({ defaultMessage: '环境变量' })}*/}
          {/*    </Select.Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          <Form.Item name={['password', 'val']} noStyle>
            {String(passwordKind) !== '1' ? (
              <Input
                className="flex-1"
                placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
              />
            ) : (
              <Select className="flex-1" options={envOptions} />
            )}
          </Form.Item>
        </Input.Group>
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
  useEffect(() => {
    setViewerForm(appendType == '1' ? paramForm : initForm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userNameKind, passwordKind])

  //表单提交成功回调
  const { loading, fun: onFinish } = useLock(
    async (values: FromValues) => {
      const newValues = { ...config, ...values }
      if (newValues.databaseUrl === undefined) {
        newValues.databaseUrl = {}
      } else if (newValues.databaseUrl.kind === undefined) {
        newValues.databaseUrl.kind = '0'
      }
      let newContent: DatasourceResp
      if (!content.id) {
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
    },
    [config, content, handleSave]
  )
  //查看页面逻辑
  if (!content) return <Error50x />

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  //表单item值改变回调
  const onValuesChange = (_allValues: FromValues) => {
    const values = form.getFieldsValue()
    if (_allValues.databaseUrl) {
      // url转参数
      const dbConfig = parseDBUrl(values.databaseUrl.val)
      if (dbConfig) {
        const { username, password, host, port, dbName } = dbConfig
        form.setFieldValue(['userName', 'val'], username)
        form.setFieldValue(['password', 'val'], password)
        form.setFieldValue('host', host)
        form.setFieldValue('port', port)
        form.setFieldValue('dbName', dbName)
      }
    } else if (
      _allValues.userName ||
      _allValues.password ||
      _allValues.host ||
      _allValues.port ||
      _allValues.dbName
    ) {
      const schemaMap: Record<string, string> = { mysql: 'mysql', postgresql: 'postgresql' }
      const schema: string = schemaMap[dbType.toLowerCase() ?? ''] ?? ''
      if (!schema) {
        console.error('未配置当前数据库scheam', dbType)
      }
      // 参数转url
      form.setFieldValue(
        ['databaseUrl', 'val'],
        `${schema}://${encodeURIComponent(values.userName.val)}${
          values.password.val ? `:${encodeURIComponent(values.password.val)}` : ''
        }@${values.host}:${values.port}/${encodeURIComponent(values.dbName)}`
      )
    }

    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length)
    setDisabled(hasErrors)
  }

  //测试连接 成功与失败提示
  const testLink = () => {
    const newValues = { ...config, ...form.getFieldsValue() }
    if (newValues.databaseUrl === undefined) {
      newValues.databaseUrl = {}
    } else if (newValues.databaseUrl.kind === undefined) {
      newValues.databaseUrl.kind = '0'
    }
    void requests
      .post('/checkDBConn', {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sourceType: content.sourceType,
        config: newValues
      })
      .then(x => {
        if (x?.status) {
          message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
        } else {
          message.error(x?.msg || intl.formatMessage({ defaultMessage: '连接失败' }))
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
        destroyOnClose
      >
        <FileList
          basePath={BASEPATH}
          setUploadPath={setUploadPath}
          setVisible={setVisible}
          upType={2}
          beforeUpload={file => {
            const isAllowed = file.name.endsWith('.db')
            if (!isAllowed) {
              message.error(intl.formatMessage({ defaultMessage: '只允许上传 db 格式文件' }))
            }
            return isAllowed || Upload.LIST_IGNORE
          }}
        />
      </Modal>

      {/* { (() => { your code })() }  useFormWarning的解决方案
      在return外定义setPage函数，当切换编辑页面时，在函数中使用useForm 返回相应的html代码*/}
      {type === 'detail' ? (
        //查看页面———————————————————————————————————————————————————————————————————————————————————
        <div>
          <div className="flex py-10px justify-end">
            <div
              className="cursor-pointer flex bg-[#F9F9F9] rounded-2px h-22px text-[#E92E5E] w-21 items-center justify-center"
              onClick={() => handleToggleDesigner('setting', content.id)}
            >
              {intl.formatMessage({ defaultMessage: '更多设置' })}
            </div>
          </div>
          <div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label={intl.formatMessage({ defaultMessage: '连接名' })}>
                {config.apiNamespace}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ defaultMessage: '数据库类型' })}>
                {config.dbType}
              </Descriptions.Item>
              {dbType === 'SQLite' ? (
                <Descriptions.Item label={intl.formatMessage({ defaultMessage: '路径' })}>
                  {config.databaseUrl?.val ?? ''}
                </Descriptions.Item>
              ) : (
                <>
                  {dbType === 'MongoDB' ? (
                    <></>
                  ) : (
                    <Descriptions.Item label={intl.formatMessage({ defaultMessage: '连接类型' })}>
                      {config.appendType == '0'
                        ? '连接URL'
                        : config.appendType == '1'
                        ? '连接参数'
                        : ''}
                    </Descriptions.Item>
                  )}

                  {config.appendType == '1' ? (
                    <>
                      <Descriptions.Item label={intl.formatMessage({ defaultMessage: '主机' })}>
                        {config.host}
                      </Descriptions.Item>
                      <Descriptions.Item label={intl.formatMessage({ defaultMessage: '端口' })}>
                        {config.port}
                      </Descriptions.Item>
                      <Descriptions.Item label={intl.formatMessage({ defaultMessage: '数据库名' })}>
                        {config.dbName}
                      </Descriptions.Item>
                      <Descriptions.Item label={intl.formatMessage({ defaultMessage: '用户' })}>
                        {config.userName?.val}
                      </Descriptions.Item>
                      <Descriptions.Item label={intl.formatMessage({ defaultMessage: '密码' })}>
                        <span className="flex items-center">
                          {isSecretShow ? (
                            <>
                              <span>{config.password?.val}</span>
                              <EyeOutlined
                                className="ml-4"
                                onClick={() => setIsSecretShow(!isSecretShow)}
                              />
                            </>
                          ) : (
                            <>
                              <span>***********</span>
                              <EyeInvisibleOutlined
                                className="ml-4"
                                onClick={() => setIsSecretShow(!isSecretShow)}
                              />
                            </>
                          )}
                        </span>
                      </Descriptions.Item>
                    </>
                  ) : (
                    <>
                      <Descriptions.Item label={intl.formatMessage({ defaultMessage: '连接URL' })}>
                        {/* {(config.databaseUrl as unknown as { kind: string; val: string })?.val} */}
                        {config.databaseUrl?.kind === '1'
                          ? `env("${config.databaseUrl.key}")`
                          : config.databaseUrl?.val}
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
                userName: config.userName || { kind: '0' },
                password: config.password || { kind: '0' },
                databaseUrl: config.databaseUrl
              }}
            >
              <Form.Item hidden name={['databaseUrl']}>
                <Input />
              </Form.Item>
              <Form.Item hidden name={['userName']}>
                <Input />
              </Form.Item>
              <Form.Item hidden name={['password']}>
                <Input />
              </Form.Item>
              <Form.Item hidden name="port">
                <Input />
              </Form.Item>
              <Form.Item hidden name="dbName">
                <Input />
              </Form.Item>
              <Form.Item hidden name="host">
                <Input />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ defaultMessage: '名称:' })}
                name="apiNamespace"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ defaultMessage: '名称不能为空' })
                  },
                  ...ruleMap.name
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                  autoComplete="off"
                  autoFocus={true}
                />
              </Form.Item>

              {dbType === 'SQLite' || dbType === 'MongoDB' ? (
                <></>
              ) : (
                <Form.Item
                  label={intl.formatMessage({ defaultMessage: '连接类型:' })}
                  name="appendType"
                >
                  <Radio.Group onChange={e => typeChange(e.target.value as string)}>
                    <Radio value="0" style={{ marginRight: '50px' }}>
                      {intl.formatMessage({ defaultMessage: '连接URL' })}
                    </Radio>
                    <Radio value="1">{intl.formatMessage({ defaultMessage: '连接参数' })}</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
              {viewerForm}
              <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button
                  className="btn-cancel"
                  onClick={() => {
                    if (content.id) {
                      handleToggleDesigner('detail', content.id, content.sourceType)
                    } else {
                      navigate('/workbench/data-source/new')
                    }
                  }}
                >
                  <span>{intl.formatMessage({ defaultMessage: '取消' })}</span>
                </Button>
                <Button className="ml-4 btn-test" onClick={() => testLink()}>
                  {intl.formatMessage({ defaultMessage: '测试' })}
                </Button>
                <Button
                  loading={loading}
                  className="ml-4 btn-save"
                  onClick={() => {
                    form.submit()
                  }}
                >
                  {intl.formatMessage({ defaultMessage: '保存' })}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        //设置页面———————————————————————————————————————————————————————————————————————————————————
        <Setting
          onSave={data => {
            handleSave({
              ...data
            })
          }}
          content={content}
          initSchema={config.schemaExtension as string}
          replaceJSON={config.replaceJSONTypeFieldConfiguration as ReplaceJSON[]}
        />
      )}
    </>
  )
}
