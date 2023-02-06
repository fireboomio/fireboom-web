import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import {
  AutoComplete,
  Button,
  Collapse,
  Descriptions,
  Form,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Upload
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { get } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import FormToolTip from '@/components/common/FormTooltip'
import Error50x from '@/components/ErrorPage/50x'
import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import requests, { getFetcher } from '@/lib/fetchers'

import FileList from './FileList'
import styles from './Rest.module.less'

interface Props {
  content: DatasourceResp
  type: ShowType
}

type Config = Record<string, string | undefined | number>

type FromValues = Record<string, string | undefined | number | Array<DataType>>

interface DataType {
  key: string
  kind: string
  val: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const columns: ColumnsType<DataType> = [
  {
    dataIndex: 'key',
    width: '30%',
    render: (_, { key }) => <span className="pl-1">{key}</span>
  },
  {
    dataIndex: 'val',
    width: '70%',
    render: (_, { kind, val }) => (
      <div className="flex items-center">
        {kind == '0' ? (
          <img
            alt="zhi"
            src="assets/iconfont/zhi.svg"
            style={{ height: '1em', width: '1em' }}
            className="text-[24px]"
          />
        ) : kind == '1' ? (
          <img
            alt="shifoubixu2"
            src="assets/iconfont/shifoubixu2.svg"
            style={{ height: '1em', width: '1em' }}
            className="text-[24px]"
          />
        ) : (
          <img
            alt="biangeng1"
            src="assets/iconfont/biangeng1.svg"
            style={{ height: '1em', width: '1em' }}
            className="text-[24px]"
          />
        )}
        <span className="ml-2">{val}</span>
      </div>
    )
  }
]

const renderIcon = (kind: string) => (
  <Image
    width={14}
    height={14}
    preview={false}
    alt="请求头类型"
    src={
      {
        0: '/assets/header-value.png',
        1: '/assets/header-env.png',
        2: '/assets/header-relay.png'
      }[kind]
    }
  />
)

declare global {
  interface Window {
    hbspt: unknown
  }
}

interface OptionT {
  label: string
  value: string
}

const BASEPATH = '/static/upload/oas'

const { TabPane } = Tabs

export default function Rest({ content, type }: Props) {
  const intl = useIntl()
  const navigate = useNavigate()
  const { handleToggleDesigner, handleSave } = useContext(DatasourceToggleContext)
  const [form] = Form.useForm()
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const [testVisible, setTestVisible] = useImmer(false) //测试按钮蒙版
  const [value, setValue] = useImmer(1)
  const [rulesObj, setRulesObj] = useImmer({})
  const [isRadioShow, setIsRadioShow] = useImmer(true)
  const [isValue, setIsValue] = useImmer(true)
  const [baseURLOptions, setBaseURLOptions] = useState<OptionT[]>([])

  const [envOpts, setEnvOpts] = useImmer<OptionT[]>([])
  const [envVal, setEnvVal] = useImmer('')

  const [visible, setVisible] = useImmer(false)

  // const [uploadPath, setUploadPath] = useState(BASEPATH)

  const setUploadPath = (v: string) => {
    form.setFieldValue('filePath', v)
    form.validateFields(['filePath'])
    initBaseUrlOptions(v)
  }

  const initBaseUrlOptions = (v: string) => {
    axios
      .get(`/api/v1/file/downloadFile?type=${1}&fileName=${encodeURIComponent(v)}`)
      .then(res => {
        const servers = get(res, 'data.servers') ?? []
        if (!form.getFieldValue('baseURL')) {
          form.setFieldsValue({
            baseURL: servers[0]?.url ?? ''
          })
        }
        setBaseURLOptions(
          servers.map((item: any) => ({ label: item?.url ?? '', value: item?.url ?? '' }))
        )
      })
      .catch(err => {
        console.error(err)
        setBaseURLOptions([])
      })
  }

  useEffect(() => {
    form.resetFields()
    if (type === 'form' && content?.config?.filePath) {
      initBaseUrlOptions(content?.config?.filePath as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  useEffect(() => {
    void getFetcher('/env')
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      .then(envs => envs.filter(x => x.isDel === 0).map(x => ({ label: x.key, value: x.key })))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .then(x => setEnvOpts(x))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onValue2Change = (value: string) => {
    setEnvVal(value)
  }

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

  if (!content) return <Error50x />

  const config = content.config as Config

  //密码显示与隐藏
  const changeEyeState = () => {
    setIsEyeShow(!isEyeShow)
  }

  // 表单选择后规则校验改变
  const onValueChange = (value: string) => {
    switch (value) {
      case '0':
        setIsValue(true)
        setRulesObj({
          pattern: /^.{1,128}$/g,
          message: intl.formatMessage({ defaultMessage: '请输入长度不大于128的非空值' })
        })
        return
      case '1':
        setIsValue(false)
        setEnvVal(envOpts.at(0)?.label ?? '')
        return
      case '2':
        setIsValue(true)
        setRulesObj({
          pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/g,
          message: intl.formatMessage({
            defaultMessage: '以字母或下划线开头，只能由字母、下划线和数字组成'
          })
        })
        return
      default:
        return
    }
  }

  const test = () => {
    const values = form.getFieldsValue()
    values.headers = (values.headers as Array<DataType>)?.filter(item => item.key != undefined)
    void requests.post('/checkDBConn', values).then((x: any) => {
      if (x?.status) {
        message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
      } else {
        message.error(x?.msg || intl.formatMessage({ defaultMessage: '连接失败' }))
      }
    })
  }
  //表单上传成功回调
  const onFinish = async (values: FromValues) => {
    values.headers = (values.headers as Array<DataType>)?.filter(item => item.key != undefined)
    const newValues = { ...values }

    //创建新的item情况post请求，并将前端用于页面切换的id删除;编辑Put请求
    let newContent: DatasourceResp
    if (!content.id) {
      const req = { ...content, config: newValues, name: values.apiNameSpace }
      const result = await requests.post<unknown, number>('/dataSource', req)
      content.id = result
      newContent = content
    } else {
      newContent = {
        ...content,
        config: newValues,
        name: values.apiNameSpace
      } as DatasourceResp
      await requests.put('/dataSource', newContent)
    }
    handleSave(newContent)
  }

  //表单上传失败回调
  const onFinishFailed = (errorInfo: object) => {
    void message.error(intl.formatMessage({ defaultMessage: '提交失败' }))
    throw errorInfo
  }

  //单选框改变，表单变化回调
  const onChangeRadio = (e: RadioChangeEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(e.target.value)
    setIsRadioShow(!isRadioShow)
  }

  const { Option } = Select
  const { Panel } = Collapse
  const onTabChange = (key: string) => {
    if (key === '1') {
      setIsValue(true)
      setRulesObj({
        pattern: /^.{1,128}$/g,
        message: intl.formatMessage({ defaultMessage: '请输入长度不大于128的非空值' })
      })
    }
  }
  const jwtType = form.getFieldValue('jwtType')
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
        // closable={false}
      >
        <FileList
          basePath={BASEPATH}
          setUploadPath={setUploadPath}
          setVisible={setVisible}
          upType={1}
          beforeUpload={file => {
            const isAllowed =
              file.name.endsWith('.json') ||
              file.name.endsWith('.yaml') ||
              file.name.endsWith('.yml')
            if (!isAllowed) {
              message.error(
                intl.formatMessage({ defaultMessage: '只允许上传 json 或 yaml 格式文件' })
              )
            }
            return isAllowed || Upload.LIST_IGNORE
          }}
        />
      </Modal>

      {type === 'detail' ? (
        //查看页面--------------------------------------------------------------------------
        <>
          <div className="flex mb-8 justify-center">
            <Descriptions bordered column={1} size="small" className={styles['descriptions-box']}>
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: '名称' })}{' '}
                      <FormToolTip title={intl.formatMessage({ defaultMessage: '名称' })} />
                    </span>
                  </>
                }
                className="justify-start"
              >
                {config.apiNameSpace}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: ' 指定 OAS' })}
                      <FormToolTip title={intl.formatMessage({ defaultMessage: ' 指定 OAS' })} />
                    </span>
                  </>
                }
              >
                <div className="flex items-center">
                  <Image
                    src="/assets/upload-file.png"
                    width={14}
                    height={14}
                    alt="文件"
                    preview={false}
                  />
                  <span className="ml-2 text-11px text-[#909399]">{config.filePath}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: 'Rest 端点' })}
                      <FormToolTip title={intl.formatMessage({ defaultMessage: 'Rest 端点' })} />
                    </span>
                  </>
                }
                className="justify-start"
              >
                {config.baseURL}
              </Descriptions.Item>
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
                      {((config?.headers as unknown as DataType[]) ?? []).map(
                        ({ key = '', kind = '', val = '' }) => (
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
                              <div className="text-0px">{renderIcon(kind)}</div>
                              <div className="flex-1 ml-2 min-w-0">{val}</div>
                            </div>
                          </Descriptions.Item>
                        )
                      )}
                    </Descriptions>
                  )
                },
                {
                  key: '2',
                  label: (
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: '授权' })}
                      <FormToolTip title={intl.formatMessage({ defaultMessage: '授权' })} />
                    </span>
                  ),
                  children: (
                    <div className="flex mb-11 justify-center">
                      <Descriptions
                        bordered
                        column={1}
                        size="small"
                        className={styles['descriptions-box']}
                      >
                        <Descriptions.Item
                          label={intl.formatMessage({ defaultMessage: 'JWT获取' })}
                        >
                          {
                            {
                              0: intl.formatMessage({ defaultMessage: '无' }),
                              1: intl.formatMessage({ defaultMessage: '静态' }),
                              2: intl.formatMessage({ defaultMessage: '动态' })
                            }[config.jwtType ?? 0]
                          }
                        </Descriptions.Item>
                        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '密钥' })}>
                          {isEyeShow ? (
                            <>
                              <span className="mr-5">
                                {(config.secret as unknown as DataType)?.val}
                              </span>
                              <img
                                alt="xiaoyanjing-chakan"
                                src="assets/iconfont/xiaoyanjing-chakan.svg"
                                style={{ height: '1em', width: '1em' }}
                                onClick={changeEyeState}
                              />
                            </>
                          ) : (
                            <>
                              <span className="mr-5">********</span>
                              <img
                                alt="xiaoyanjing-yincang"
                                src="assets/iconfont/xiaoyanjing-yincang.svg"
                                style={{ height: '1em', width: '1em' }}
                                onClick={changeEyeState}
                              />
                            </>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={intl.formatMessage({ defaultMessage: '签名方法' })}
                        >
                          {config.signingMethod}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={intl.formatMessage({ defaultMessage: 'Token端点' })}
                        >
                          {config.tokenPoint}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  )
                }
              ]}
            />
          </div>
          <Collapse
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
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item
                  label={
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: '是否状态联合' })}
                    </span>
                  }
                  className="justify-start"
                >
                  {config.statusCodeUnions ? (
                    <Tag color="green">{intl.formatMessage({ defaultMessage: '开启' })}</Tag>
                  ) : (
                    <Tag color="red">{intl.formatMessage({ defaultMessage: '关闭' })}</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          </Collapse>
          {/* 测试功能 */}
          <Modal
            centered
            open={testVisible}
            onCancel={() => setTestVisible(false)}
            destroyOnClose={true}
            width={'80%'}
            bodyStyle={{ height: '885px', overflow: 'auto' }}
            footer={null}
          >
            <div className={styles['redoc-container']}>
              {testVisible && config.filePath && (
                <iframe
                  title="rapi"
                  src={`/#/rapi-frame?url=/upload/oas/${config.filePath ?? ''}`}
                  width={'100%'}
                  height={'100%'}
                  className="border-none"
                />
              )}
            </div>
          </Modal>
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
              onFinish={values => onFinish(values as Config)}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger={['onBlur', 'onChange']}
              labelAlign="right"
              className="ml-3"
              initialValues={{
                apiNameSpace: config.apiNameSpace,
                baseURL: config.baseURL,
                headers: config.headers || [],
                statusCodeUnions: config.statusCodeUnions,
                secret: config.secret || { kind: '0' },
                filePath: config.filePath || '',
                tokenPoint: config.tokenPoint,
                jwtType: config.jwtType
              }}
            >
              <Form.Item
                label={
                  <>
                    <span>{intl.formatMessage({ defaultMessage: '名称' })}</span>
                    <FormToolTip title={intl.formatMessage({ defaultMessage: '名称' })} />
                  </>
                }
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ defaultMessage: '请输入名称' })
                  },
                  {
                    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/g,
                    message: intl.formatMessage({
                      defaultMessage: '以字母或下划线开头，只能由字母、下划线和数字组成'
                    })
                  }
                ]}
                name="apiNameSpace"
                colon={false}
                style={{ marginBottom: '20px' }}
              >
                <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ defaultMessage: '请上传 OAS 文件' })
                  }
                ]}
                label={
                  <>
                    <span>{intl.formatMessage({ defaultMessage: '指定 OAS' })}</span>
                    <FormToolTip title={intl.formatMessage({ defaultMessage: '指定OAS' })} />
                  </>
                }
                colon={false}
                name="filePath"
                // valuePropName="filePath"
                style={{ marginBottom: '20px' }}
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
              <Form.Item
                label={
                  <>
                    <span>{intl.formatMessage({ defaultMessage: 'Rest 端点' })}</span>
                    <FormToolTip title={intl.formatMessage({ defaultMessage: 'Rest 端点' })} />
                  </>
                }
                rules={[
                  {
                    required: true,
                    type: 'url',
                    message: intl.formatMessage({ defaultMessage: '只允许输入链接' })
                  }
                ]}
                name="baseURL"
                colon={false}
                style={{ marginBottom: '20px' }}
              >
                <AutoComplete
                  options={baseURLOptions}
                  filterOption={(inputValue, option) => {
                    return true
                  }}
                  placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                />
              </Form.Item>

              <div className="tabs-form">
                <Tabs defaultActiveKey="1" className="ml-3" onChange={onTabChange}>
                  <TabPane tab={intl.formatMessage({ defaultMessage: '请求头' })} key="1">
                    <Form.Item
                      wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 24 }
                      }}
                    >
                      <Form.List name="headers">
                        {(fields, { add, remove }, { errors }) => (
                          <>
                            {fields.map((field, index) => (
                              <Space key={field.key} align="baseline">
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
                                    <Option value="0">
                                      <Space>
                                        <span>{renderIcon('0')}</span>
                                        {intl.formatMessage({ defaultMessage: '值' })}
                                      </Space>
                                    </Option>
                                    <Option value="1">
                                      <Space>
                                        <span>{renderIcon('1')}</span>
                                        {intl.formatMessage({ defaultMessage: '环境变量' })}
                                      </Space>
                                    </Option>
                                    <Option value="2">
                                      <Space>
                                        <span>{renderIcon('2')}</span>
                                        {intl.formatMessage({ defaultMessage: '转发自客户端' })}
                                      </Space>
                                    </Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  className="w-135"
                                  wrapperCol={{ span: 24 }}
                                  name={[field.name, 'val']}
                                  rules={
                                    form.getFieldValue(['headers', field.name, 'kind']) === '0'
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
                                  {form.getFieldValue(['headers', field.name, 'kind']) === '0' ? (
                                    <Input
                                      style={{ width: '80%' }}
                                      placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
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
                                <img
                                  alt="guanbi"
                                  src="assets/iconfont/guanbi.svg"
                                  style={{ height: '1em', width: '1em' }}
                                  onClick={() => remove(index)}
                                />
                              </Space>
                            ))}

                            <Form.Item wrapperCol={{ span: 16 }}>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  setIsValue(true)
                                  add({ kind: '0' })
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
                  {/* <TabPane
                    tab={
                      <div>
                        <span>{intl.formatMessage({ defaultMessage: '授权' })}</span>
                        <img
                          alt="wenhao"
                          src="assets/iconfont/wenhao.svg"
                          style={{ height: '1em', width: '1em' }}
                          className={`${styles['form-icon']} ml-1`}
                        />
                      </div>
                    }
                    key="2"
                  >
                    <Form.Item
                      label={intl.formatMessage({ defaultMessage: 'JWT获取' })}
                      name="jwtType"
                      initialValue={'0'}
                    >
                      <Radio.Group onChange={onChangeRadio} value={value}>
                        <Radio value={'0'} className="mr-20">
                          {intl.formatMessage({ defaultMessage: '无' })}
                        </Radio>
                        <Radio value={'1'} className="mr-20">
                          {intl.formatMessage({ defaultMessage: '静态' })}
                        </Radio>
                        <Radio value={'2'}>{intl.formatMessage({ defaultMessage: '动态' })}</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {jwtType === '1' ? (
                      <>
                        <Form.Item label={intl.formatMessage({ defaultMessage: '密钥' })}>
                          <Input.Group compact>
                            <Form.Item name={['secret', 'kind']} noStyle>
                              <Select className="w-1/5" onChange={onValueChange}>
                                <Option value="0">
                                  {intl.formatMessage({ defaultMessage: '值' })}
                                </Option>
                                <Option value="1">
                                  {intl.formatMessage({ defaultMessage: '环境变量' })}
                                </Option>
                              </Select>
                            </Form.Item>
                            {isValue ? (
                              <Form.Item name={['secret', 'val']} noStyle rules={[rulesObj]}>
                                <Input
                                  style={{ width: '80%' }}
                                  placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                                />
                              </Form.Item>
                            ) : (
                              <Form.Item name={['secret', 'val']} noStyle rules={[rulesObj]}>
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

                        <Form.Item
                          label={intl.formatMessage({ defaultMessage: '签名方法' })}
                          name="signingMethod"
                          initialValue={'HS256'}
                        >
                          <Radio value={'HS256'} checked>
                            HS256
                          </Radio>
                        </Form.Item>
                      </>
                    ) : null}
                    {jwtType === '2' ? (
                      <>
                        <Form.Item label={intl.formatMessage({ defaultMessage: '密钥' })}>
                          <Input.Group compact>
                            <Form.Item name={['secret', 'kind']} noStyle>
                              <Select className="w-1/5" onChange={onValueChange}>
                                <Option value="0">
                                  {intl.formatMessage({ defaultMessage: '值' })}
                                </Option>
                                <Option value="1">
                                  {intl.formatMessage({ defaultMessage: '环境变量' })}
                                </Option>
                              </Select>
                            </Form.Item>
                            <Form.Item name={['secret', 'val']} noStyle rules={[rulesObj]}>
                              {isValue ? (
                                <Input
                                  style={{ width: '80%' }}
                                  placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
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
                          </Input.Group>
                        </Form.Item>
                        <Form.Item
                          label={
                            <>
                              <span>{intl.formatMessage({ defaultMessage: 'Token 端点' })}</span>
                              <img
                                alt="wenhao"
                                src="assets/iconfont/wenhao.svg"
                                style={{ height: '1em', width: '1em' }}
                                className={`${styles['form-icon']} ml-1`}
                              />
                            </>
                          }
                          colon={false}
                          required
                          style={{ marginBottom: '20px' }}
                          name="tokenPoint"
                        >
                          <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
                        </Form.Item>
                      </>
                    ) : null}
                  </TabPane> */}
                </Tabs>
              </div>
              <Collapse
                ghost
                bordered={false}
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              >
                <Panel
                  header={intl.formatMessage({ defaultMessage: '更多' })}
                  key="1"
                  className="site-collapse-custom-panel"
                >
                  <Form.Item
                    label={
                      <>
                        <span className={styles['label-style']}>
                          {intl.formatMessage({ defaultMessage: '是否状态联合' })}
                          <FormToolTip
                            title={intl.formatMessage({ defaultMessage: '是否状态联合' })}
                          />
                        </span>
                      </>
                    }
                    name="statusCodeUnions"
                    colon={false}
                    style={{ marginBottom: 0 }}
                    valuePropName="checked"
                  >
                    <Switch className={styles['switch-edit-btn']} size="small" />
                  </Form.Item>
                </Panel>
              </Collapse>

              <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
                <div className="flex mt-10 w-160px justify-center items-center">
                  <Button
                    className={'btn-cancel  ml-4'}
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
                  {/*<Button*/}
                  {/*  className={'btn-test ml-4'}*/}
                  {/*  onClick={() => {*/}
                  {/*    test()*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  {intl.formatMessage({ defaultMessage: '测试' })}*/}
                  {/*</Button>*/}
                  <Button className={'btn-save ml-4'} onClick={() => form.submit()}>
                    {content.name == ''
                      ? intl.formatMessage({ defaultMessage: '创建' })
                      : intl.formatMessage({ defaultMessage: '保存' })}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </>
  )
}
