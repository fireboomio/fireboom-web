import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tabs,
  Upload
} from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import type { Rule } from 'antd/lib/form'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import FormToolTip from '@/components/common/FormTooltip'
import Error50x from '@/components/ErrorPage/50x'
import { useValidate } from '@/hooks/validate'
import type { ShowType } from '@/interfaces/datasource'
import { UploadDirectory } from '@/interfaces/fs'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import useEnvOptions from '@/lib/hooks/useEnvOptions'
import { getConfigurationVariableField, getConfigurationVariableRender } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

import FileList from './FileList'
// import GraphiQLApp from '../../../pages/graphiql'
import styles from './Graphql.module.less'
import { renderIcon, valueHeadersToRequestHeaders } from './Rest'

interface Props {
  content: ApiDocuments.Datasource
  type: ShowType
}

interface DataType {
  key: string
  kind: string
  val: string
}

type FromValues = Record<string, string | undefined | number | Array<DataType>>

export default function Graphql({ content, type }: Props) {
  const intl = useIntl()
  const { ruleMap } = useValidate()
  const navigate = useNavigate()
  const { handleSave, handleToggleDesigner } = useContext(DatasourceToggleContext)
  const [rulesObj, setRulesObj] = useImmer<Rule>({})
  const [isShowUpSchema, setIsShowUpSchema] = useImmer(true)
  const [isModalVisible, setIsModalVisible] = useImmer(false)
  const [isValue, setIsValue] = useImmer(true)

  const envOpts = useEnvOptions()
  const [envVal, setEnvVal] = useImmer('')
  const [visible, setVisible] = useImmer(false)

  const [form] = Form.useForm()
  const { Option } = Select
  const urlReg = /^https?:\/\/[-.\w\d:/]+$/i
  // /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
  useEffect(() => {
    setIsShowUpSchema(!content.customGraphql.schemaFilepath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  //表单提交成功回调
  const { loading, fun: onFinish } = useLock(
    async (values: FromValues) => {
      let { headers, agreement, ...newContent } = values
      newContent = {
        ...content,
        ...newContent
      }
      newContent.customGraphql.headers = valueHeadersToRequestHeaders(
        headers as ApiDocuments.ConfigurationVariable[]
      )
      // for (const key in headers) {
      //   if (!values.headers[key]) {
      //     delete values.headers[key]
      //   }
      // }
      // values.headers = values.headers?.filter(item => item.key != undefined)
      // const newValues = { ...values }

      //创建新的item情况post请求，并将前端用于页面切换的id删除;编辑Put请求
      if (!content.name) {
        await requests.post('/datasource', newContent)
      } else {
        await requests.put('/datasource', newContent)
      }
      handleSave(newContent!)
    },
    [content, handleSave]
  )

  //表单提交失败回调
  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  // 表单选择后规则校验改变
  const onValueChange = (value: string) => {
    switch (value) {
      case '0':
        setIsValue(true)
        setRulesObj({
          pattern: /^.{1,2000}$/g,
          message: intl.formatMessage({ defaultMessage: '请输入长度不大于2000的非空值' })
        })
        return
      case '1':
        setIsValue(false)
        setEnvVal(envOpts.at(0)?.label ?? '')
        return
      case '2':
        setIsValue(true)
        setRulesObj({
          pattern: /^\w+$/g,
          message: intl.formatMessage({ defaultMessage: '请输入非空值' })
        })
        return
      default:
        return
    }
  }

  const onValue2Change = (value: string) => {
    setEnvVal(value)
  }

  // const handleChange = (_value: string | string[]) => {
  //   setRulesObj({
  //     type: 'array',
  //     validator(_, value) {
  //       if (!value) return
  //       return value.every((v: string) => v.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/g))
  //         ? Promise.resolve()
  //         : Promise.reject(
  //             intl.formatMessage({
  //               defaultMessage: '以字母或下划线开头，只能由字母、下划线和数字组成'
  //             })
  //           )
  //     }
  //   })
  // }

  //开关切换回调 (查看页面的是否开启数据源开关)
  // const connectSwitchOnChange = (isChecked: boolean) => {
  //   void requests
  //     .put('/dataSource', {
  //       ...content,
  //       enabled: isChecked == true ? 0 : 1
  //     })
  //     .then(() => {
  //       handleSave({
  //         ...content,
  //         switch: isChecked == true ? 0 : 1
  //       })
  //     })
  // }

  async function testGql() {
    if (await form.validateFields()) {
      const { agreement, headers, ...values } = form.getFieldsValue()

      const newContent = {
        ...content,
        ...values
      }
      newContent.customGraphql.headers = valueHeadersToRequestHeaders(
        headers as ApiDocuments.ConfigurationVariable[]
      )
      requests.post('/datasource/checkConnection', newContent).then(() => {
        message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
      })
    }
  }

  const setUploadPath = (v: string) => {
    form.setFieldValue(['customGraphql', 'schemaFilepath'], v)
  }

  if (!content) {
    return <Error50x />
  }

  return (
    <>
      {type === 'detail' ? (
        //查看页面--------------------------------------------------------------------------
        <>
          <div className="flex mb-8 justify-center">
            <Descriptions bordered column={1} size="small" labelStyle={{ width: 190 }}>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: '名称' })}
                      <FormToolTip title={intl.formatMessage({ defaultMessage: '名称' })} />
                    </span>
                  </div>
                }
                className="justify-start"
              >
                {content.name}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: 'Graphql 端点' })}
                      <FormToolTip title={intl.formatMessage({ defaultMessage: 'Graphql 端点' })} />
                    </span>
                  </div>
                }
                className="justify-start"
              >
                {content.customGraphql.endpoint}
              </Descriptions.Item>

              {content.customGraphql.schemaFilepath ? (
                <Descriptions.Item
                  label={
                    <div>
                      <span className={styles['label-style']}>
                        {intl.formatMessage({ defaultMessage: '指定Schema' })}
                        <FormToolTip title={intl.formatMessage({ defaultMessage: '指定Schema' })} />
                      </span>
                    </div>
                  }
                  className="justify-start"
                >
                  <img
                    alt="wenjian1"
                    src="assets/iconfont/wenjian1.svg"
                    style={{ height: '1em', width: '1em' }}
                  />{' '}
                  {content.customGraphql.schemaFilepath}
                </Descriptions.Item>
              ) : (
                ''
              )}
            </Descriptions>
          </div>
          <div className="tabs-form">
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: intl.formatMessage({ defaultMessage: '请求头' }),
                  children: (
                    <Descriptions
                      className="mb-8"
                      bordered
                      column={1}
                      size="small"
                      labelStyle={{ width: 190 }}
                    >
                      {Object.keys(content.customGraphql.headers ?? {}).map(key => {
                        const item = content.customGraphql.headers[key]
                        return (
                          <Descriptions.Item
                            key={key}
                            label={
                              <div>
                                <span className={styles['label-style']}>
                                  {key}
                                  <FormToolTip title={key} />
                                </span>
                              </div>
                            }
                            className="justify-start"
                            style={{ wordBreak: 'break-all' }}
                          >
                            <div className="flex items-center">
                              <div className="text-0px">{renderIcon(item.values[0].kind)}</div>
                              <div className="flex-1 ml-2 min-w-0">
                                {getConfigurationVariableRender(item.values[0])}
                              </div>
                            </div>
                          </Descriptions.Item>
                        )
                      })}
                    </Descriptions>
                  )
                }
              ]}
            />
          </div>
          {/* <Collapse
            ghost
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <img
                alt=""
                className="w-5"
                style={{ transform: isActive ? '' : 'rotate(-90deg)' }}
                src="/assets/shape-down.svg"
              />
            )}
            className={`${styles['collapse-box']} site-collapse-custom-collapse bg-light-50`}
          >
            <Panel
              header={intl.formatMessage({ defaultMessage: '更多设置' })}
              key="1"
              className="site-collapse-custom-panel"
            >
              <div className="flex mb-8 justify-center">
                <Descriptions bordered column={1} size="small" labelStyle={{ width: 190 }}>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '是否内部' })}
                          <FormToolTip title={intl.formatMessage({ defaultMessage: '是否内部' })} />
                        </span>
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.internal ? (
                      <Tag color="green">{intl.formatMessage({ defaultMessage: '开启' })}</Tag>
                    ) : (
                      <Tag color="red">{intl.formatMessage({ defaultMessage: '关闭' })}</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '自定义Float标量' })}
                          <FormToolTip
                            title={intl.formatMessage({ defaultMessage: '自定义Float标量' })}
                          />
                        </span>
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.customFloatScalars}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '自定义INT标量' })}
                          <FormToolTip
                            title={intl.formatMessage({ defaultMessage: '自定义INT标量' })}
                          />
                        </span>
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.customIntScalars}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '排除重命名根字段' })}
                          <FormToolTip
                            title={intl.formatMessage({ defaultMessage: '排除重命名根字段' })}
                          />
                        </span>
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.skipRenameRootFields}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Panel>
          </Collapse> */}
        </>
      ) : (
        //编辑页面--------------------------------------------------------------------------
        <>
          <div className="rounded-xl mb-4 py-6">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 11 }}
              onFinish={values => void onFinish(values)}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger={['onBlur', 'onChange']}
              className="ml-3"
              labelAlign="right"
              initialValues={{
                ...content,
                agreement: content.customGraphql.schemaFilepath ? false : true,
                headers: Object.keys(
                  content.customGraphql.headers || {}
                ).map<ApiDocuments.ConfigurationVariable>(key => {
                  const item = content.customGraphql.headers[key]
                  return {
                    key,
                    ...item.values[0]
                  }
                })
              }}
            >
              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: '名称' })}:
                      <FormToolTip title={intl.formatMessage({ defaultMessage: '名称' })} />
                    </span>
                  </div>
                }
                colon={false}
                style={{ marginBottom: '20px' }}
                name="name"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ defaultMessage: '名称不能为空' })
                  },
                  ...ruleMap.name
                ]}
              >
                <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
              </Form.Item>

              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: 'Graphql 端点' })}:
                      <FormToolTip title={intl.formatMessage({ defaultMessage: 'Graphql 端点' })} />
                    </span>
                  </div>
                }
                colon={false}
                required
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ defaultMessage: '端点不能为空' })
                  },
                  {
                    pattern: urlReg,
                    message: intl.formatMessage({ defaultMessage: '请填写规范域名' })
                  }
                ]}
                style={{ marginBottom: '20px' }}
                name={['customGraphql', 'endpoint']}
              >
                <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
              </Form.Item>

              <Form.Item name="agreement" label=" " valuePropName="checked">
                <Checkbox
                  onChange={() => {
                    setIsShowUpSchema(!isShowUpSchema)
                  }}
                >
                  {intl.formatMessage({ defaultMessage: '通过发送指令,自动内省Schema' })}
                </Checkbox>
              </Form.Item>
              {!isShowUpSchema ? (
                <Form.Item
                  label={
                    <div>
                      <span className={styles['label-style']}>
                        {intl.formatMessage({ defaultMessage: '指定Schema' })}:
                        <FormToolTip title={intl.formatMessage({ defaultMessage: '指定Schema' })} />
                      </span>
                    </div>
                  }
                  colon={false}
                  name={['customGraphql', 'schemaFilepath']}
                  required
                  // valuePropName="fileList"
                  style={{ marginBottom: '48px' }}
                  // getValueFromEvent={normFile}
                >
                  <Input
                    placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                    onClick={() => setVisible(true)}
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    suffix={
                      <a onClick={() => setVisible(true)}>
                        {intl.formatMessage({ defaultMessage: '浏览' })}
                      </a>
                    }
                    readOnly
                    // value={uploadPath}
                  />
                </Form.Item>
              ) : (
                ''
              )}

              <div className="tabs-form">
                <Tabs defaultActiveKey="1" className="ml-3">
                  <TabPane tab={intl.formatMessage({ defaultMessage: '请求头' })} key="1">
                    <Form.Item
                      wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 24 }
                      }}
                    >
                      <Form.List name={['headers']}>
                        {(fields, { add, remove }, { errors }) => (
                          <>
                            {fields.map((field, index) => {
                              const kind = form.getFieldValue(['headers', field.name, 'kind'])
                              return (
                                <Space key={field.key} align="baseline" className="w-full">
                                  <Form.Item
                                    className="w-52.5"
                                    wrapperCol={{ span: 24 }}
                                    name={[field.name, 'key']}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <Form.Item
                                    className="w-40"
                                    wrapperCol={{ span: 24 }}
                                    name={[field.name, 'kind']}
                                  >
                                    <Select onChange={onValueChange}>
                                      <Option value={0}>
                                        <div className="flex items-center">
                                          {renderIcon(0)}
                                          {intl.formatMessage({ defaultMessage: '值' })}
                                        </div>
                                      </Option>
                                      <Option value={1}>
                                        <div className="flex items-center">
                                          {renderIcon(1)}
                                          {intl.formatMessage({ defaultMessage: '环境变量' })}
                                        </div>
                                      </Option>
                                      <Option value={2}>
                                        <div className="flex items-center">
                                          {renderIcon(2)}
                                          {intl.formatMessage({ defaultMessage: '转发自客户端' })}
                                        </div>
                                      </Option>
                                    </Select>
                                  </Form.Item>
                                  <Form.Item
                                    className="w-135"
                                    wrapperCol={{ span: 24 }}
                                    name={[field.name, getConfigurationVariableField(kind)]}
                                    rules={
                                      kind !== 1
                                        ? [
                                            {
                                              pattern: /^.{1,128}$/g,
                                              message: intl.formatMessage({
                                                defaultMessage: '请输入长度不大于128的非空值'
                                              })
                                            }
                                          ]
                                        : []
                                    }
                                  >
                                    {kind !== 1 ? (
                                      <Input
                                        style={{ width: '80%' }}
                                        placeholder={intl.formatMessage({
                                          defaultMessage: '请输入'
                                        })}
                                      />
                                    ) : (
                                      <Select
                                        className="w-1/5"
                                        style={{ width: '80%' }}
                                        options={envOpts}
                                        value={envVal}
                                        onChange={onValue2Change}
                                      />
                                    )}
                                  </Form.Item>
                                  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                                  <img
                                    alt="guanbi"
                                    src="assets/iconfont/guanbi.svg"
                                    style={{ height: '1em', width: '1em' }}
                                    onClick={() => remove(index)}
                                  />
                                </Space>
                              )
                            })}

                            <Form.Item wrapperCol={{ span: 16 }}>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  setIsValue(true)
                                  add({ kind: 0 })
                                }}
                                icon={<PlusOutlined />}
                                className="text-gray-500/60 w-1/1"
                              >
                                {intl.formatMessage({ defaultMessage: '新增请求头信息' })}
                              </Button>
                              <Form.ErrorList errors={errors} />
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </TabPane>
                </Tabs>
              </div>

              {/* <Collapse
                ghost
                bordered={false}
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className={`${styles['collapse-box']} site-collapse-custom-collapse bg-white-50`}
              >
                <Panel
                  header={intl.formatMessage({ defaultMessage: '更多设置' })}
                  key="1"
                  className="site-collapse-custom-panel"
                >
                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '是否内部' })}
                          <FormToolTip title={intl.formatMessage({ defaultMessage: '是否内部' })} />
                        </span>
                      </div>
                    }
                    valuePropName="checked"
                    name="internal"
                    colon={false}
                    style={{ marginBottom: '20px' }}
                  >
                    <Switch className={styles['switch-edit-btn']} size="small" />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div className="">
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '自定义Float标量' })}
                          <FormToolTip
                            title={intl.formatMessage({ defaultMessage: '自定义Float标量' })}
                          />
                        </span>
                      </div>
                    }
                    name="customFloatScalars"
                    rules={[rulesObj]}
                    colon={false}
                    style={{ marginBottom: '20px' }}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Tags Mode"
                      onChange={handleChange}
                    >
                      {children}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '自定义INT标量' })}
                          <FormToolTip
                            title={intl.formatMessage({ defaultMessage: '自定义INT标量' })}
                          />
                        </span>
                      </div>
                    }
                    name="customIntScalars"
                    rules={[rulesObj]}
                    colon={false}
                    style={{ marginBottom: '20px' }}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Tags Mode"
                      onChange={handleChange}
                    >
                      {children}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '排除重命名根字段' })}
                          <FormToolTip
                            title={intl.formatMessage({ defaultMessage: '排除重命名根字段' })}
                          />
                        </span>
                      </div>
                    }
                    colon={false}
                    style={{ marginBottom: '20px' }}
                    name="skipRenameRootFields"
                    rules={[rulesObj]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Tags Mode"
                      onChange={handleChange}
                    >
                      {children}
                    </Select>
                  </Form.Item>
                </Panel>
              </Collapse> */}
            </Form>
            <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
              <div className="flex mt-5 w-40 justify-center items-center">
                <Button
                  className={'btn-cancel ml-4'}
                  onClick={() => {
                    if (content.name) {
                      handleToggleDesigner('detail', content.name, content.sourceType)
                    } else {
                      navigate('/workbench/data-source/new')
                    }
                  }}
                >
                  <span>{intl.formatMessage({ defaultMessage: '取消' })}</span>
                </Button>
                <Button
                  className={'btn-test ml-4'}
                  onClick={() => {
                    testGql()
                  }}
                >
                  {intl.formatMessage({ defaultMessage: '测试' })}
                </Button>
                <Button
                  loading={loading}
                  className={'btn-save ml-4'}
                  onClick={() => {
                    form.submit()
                  }}
                >
                  {content.name == ''
                    ? intl.formatMessage({ defaultMessage: '创建' })
                    : intl.formatMessage({ defaultMessage: '保存' })}
                </Button>
              </div>
            </Form.Item>
          </div>
        </>
      )}

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
          dir={UploadDirectory.Graphql}
          setUploadPath={setUploadPath}
          setVisible={setVisible}
          beforeUpload={file => {
            console.log(file.name)
            const isAllowed = file.name.endsWith('.graphql')
            if (!isAllowed) {
              message.error(intl.formatMessage({ defaultMessage: '只允许上传 graphql 格式文件' }))
            }
            return isAllowed || Upload.LIST_IGNORE
          }}
        />
      </Modal>

      <Modal
        title="GraphiQL"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{ height: '90vh' }}
        width={'90vw'}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        {/* <GraphiQLApp url={config.url as string} data={''} onSave={() => {}} /> */}
      </Modal>
    </>
  )
}
