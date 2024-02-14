import { PlusOutlined } from '@ant-design/icons'
import {
  AutoComplete,
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Tabs,
  Upload,
  message
} from 'antd'
import axios from 'axios'
import { get } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import FormToolTip from '@/components/common/FormTooltip'
import { useValidate } from '@/hooks/validate'
import type { ShowType } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import useEnvOptions from '@/lib/hooks/useEnvOptions'
import { useDict } from '@/providers/dict'
import { getConfigurationVariableField, getConfigurationVariableRender } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

import InputOrFromEnvWithItem, { InputOrFromEnv } from '@/components/InputOrFromEnv'
import FileList from './FileList'
import styles from './Rest.module.less'

interface Props {
  content: ApiDocuments.Datasource
  type: ShowType
}

type FromValues = Record<string, string | undefined | number | Array<DataType>>

interface DataType {
  key: string
  kind: number
  val: string
}

export const renderIcon = (kind: number) => (
  <img
    width={14}
    height={14}
    alt="请求头类型"
    className="mr-2"
    src={
      {
        0: `${import.meta.env.BASE_URL}assets/header-value.png`,
        1: `${import.meta.env.BASE_URL}assets/header-env.png`,
        2: `${import.meta.env.BASE_URL}assets/header-relay.png`
      }[kind]
    }
  />
)

export function valueHeadersToRequestHeaders(headers: ApiDocuments.ConfigurationVariable[]) {
  return headers.reduce<Record<string, any>>((obj, cur) => {
    const { key, ...rest } = cur
    obj[key] = { values: [rest] }
    return obj
  }, {})
}

declare global {
  interface Window {
    hbspt: unknown
  }
}

interface OptionT {
  label: string
  value: string
}

const { TabPane } = Tabs

export default function Rest({ content, type }: Props) {
  const intl = useIntl()
  const dict = useDict()
  const { ruleMap } = useValidate()
  const navigate = useNavigate()
  const { handleToggleDesigner, handleSave } = useContext(DatasourceToggleContext)
  const [form] = Form.useForm()
  // const [isEyeShow, setIsEyeShow] = useImmer(false)
  // const [testVisible, setTestVisible] = useImmer(false) //测试按钮蒙版
  // const [value, setValue] = useImmer(1)
  const [rulesObj, setRulesObj] = useImmer({})
  // const [isRadioShow, setIsRadioShow] = useImmer(true)
  const [isValue, setIsValue] = useImmer(true)
  const [baseURLOptions, setBaseURLOptions] = useState<OptionT[]>([])
  const envOpts = useEnvOptions()
  const [envVal, setEnvVal] = useImmer('')

  const [visible, setVisible] = useImmer(false)

  // const [uploadPath, setUploadPath] = useState(BASEPATH)

  const setUploadPath = (v: string) => {
    form.setFieldValue(['customRest', 'oasFilepath'], v)
    form.validateFields(['customRest', 'oasFilepath'])
    initBaseUrlOptions(v)
  }

  const initBaseUrlOptions = (v: string) => {
    axios
      .get(`/api/vscode/readFile?uri=${dict.oas}/${v}`)
      .then(res => {
        const servers = get(res, 'data.servers') ?? []
        if (!form.getFieldValue(['customRest', 'baseUrl'])) {
          form.setFieldValue(['customRest', 'baseUrl'], servers[0]?.url ?? '')
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
    if (type === 'form' && content?.customRest.oasFilepath) {
      initBaseUrlOptions(content.customRest.oasFilepath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  const onValue2Change = (value: string) => {
    setEnvVal(value)
  }

  // const connectSwitchOnChange = (isChecked: boolean) => {
  //   void requests
  //     .put('/datasource', {
  //       ...content,
  //       switch: isChecked == true ? 0 : 1
  //     })
  //     .then(() => {
  //       handleSave({
  //         ...content,
  //         switch: isChecked == true ? 0 : 1
  //       })
  //     })
  // }

  // const config = content?.config as Config

  //密码显示与隐藏
  // const changeEyeState = () => {
  //   setIsEyeShow(!isEyeShow)
  // }

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

  // const test = () => {
  //   const values = form.getFieldsValue()
  //   values.headers = (values.headers as Array<DataType>)?.filter(item => item.key != undefined)
  //   void requests.post('/datasource/checkConnection', values).then((x: any) => {
  //     if (x?.status) {
  //       message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
  //     } else {
  //       message.error(x?.msg || intl.formatMessage({ defaultMessage: '连接失败' }))
  //     }
  //   })
  // }
  //表单上传成功回调
  const { loading, fun: onFinish } = useLock(
    async (values: FromValues) => {
      let { headers, ...newContent } = values
      newContent = {
        ...content,
        ...newContent
      }
      newContent.customRest.headers = valueHeadersToRequestHeaders(
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
  if (!content) return <Error50x />

  //表单上传失败回调
  const onFinishFailed = (errorInfo: object) => {
    void message.error(intl.formatMessage({ defaultMessage: '提交失败' }))
    throw errorInfo
  }

  //单选框改变，表单变化回调
  // const onChangeRadio = (e: RadioChangeEvent) => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //   setValue(e.target.value)
  //   setIsRadioShow(!isRadioShow)
  // }

  const { Option } = Select
  // const { Panel } = Collapse
  const onTabChange = (key: string) => {
    if (key === '1') {
      setIsValue(true)
      setRulesObj({
        pattern: /^.{1,128}$/g,
        message: intl.formatMessage({ defaultMessage: '请输入长度不大于128的非空值' })
      })
    }
  }
  // const jwtType = form.getFieldValue('jwtType')
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
          dir={dict.oas}
          setUploadPath={setUploadPath}
          setVisible={setVisible}
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
                {content.name}
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
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    window.open(
                      `/api/vscode/readFile?uri=${dict.oas}/${content.customRest.oasFilepath}`,
                      '_blank'
                    )
                  }
                >
                  <Image
                    src={`${import.meta.env.BASE_URL}assets/upload-file.png`}
                    width={14}
                    height={14}
                    alt="文件"
                    preview={false}
                  />
                  <span className="ml-2 text-11px text-[#909399]">
                    {content.customRest.oasFilepath}
                  </span>
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
                {getConfigurationVariableRender(content.customRest.baseUrl)}
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
                      {Object.keys(content.customRest.headers ?? {}).map(key => {
                        const item = content.customRest.headers[key]
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
                // {
                //   key: '2',
                //   label: (
                //     <span className={styles['label-style']}>
                //       {intl.formatMessage({ defaultMessage: '授权' })}
                //       <FormToolTip title={intl.formatMessage({ defaultMessage: '授权' })} />
                //     </span>
                //   ),
                //   children: (
                //     <div className="flex mb-11 justify-center">
                //       <Descriptions
                //         bordered
                //         column={1}
                //         size="small"
                //         className={styles['descriptions-box']}
                //       >
                //         <Descriptions.Item
                //           label={intl.formatMessage({ defaultMessage: 'JWT获取' })}
                //         >
                //           {
                //             {
                //               0: intl.formatMessage({ defaultMessage: '无' }),
                //               1: intl.formatMessage({ defaultMessage: '静态' }),
                //               2: intl.formatMessage({ defaultMessage: '动态' })
                //             }[config.jwtType ?? 0]
                //           }
                //         </Descriptions.Item>
                //         <Descriptions.Item label={intl.formatMessage({ defaultMessage: '密钥' })}>
                //           {isEyeShow ? (
                //             <>
                //               <span className="mr-5">
                //                 {(config.secret as unknown as DataType)?.val}
                //               </span>
                //               <img
                //                 alt="xiaoyanjing-chakan"
                //                 src="assets/iconfont/xiaoyanjing-chakan.svg"
                //                 style={{ height: '1em', width: '1em' }}
                //                 onClick={changeEyeState}
                //               />
                //             </>
                //           ) : (
                //             <>
                //               <span className="mr-5">********</span>
                //               <img
                //                 alt="xiaoyanjing-yincang"
                //                 src="assets/iconfont/xiaoyanjing-yincang.svg"
                //                 style={{ height: '1em', width: '1em' }}
                //                 onClick={changeEyeState}
                //               />
                //             </>
                //           )}
                //         </Descriptions.Item>
                //         <Descriptions.Item
                //           label={intl.formatMessage({ defaultMessage: '签名方法' })}
                //         >
                //           {config.signingMethod}
                //         </Descriptions.Item>
                //         <Descriptions.Item
                //           label={intl.formatMessage({ defaultMessage: 'Token端点' })}
                //         >
                //           {config.tokenPoint}
                //         </Descriptions.Item>
                //       </Descriptions>
                //     </div>
                //   )
                // }
              ]}
            />
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
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item
                  label={
                    <span className={styles['label-style']}>
                      {intl.formatMessage({ defaultMessage: '是否状态联合' })}
                    </span>
                  }
                  className="justify-start"
                >
                  {content.customRest.statusCodeUnions ? (
                    <Tag color="green">{intl.formatMessage({ defaultMessage: '开启' })}</Tag>
                  ) : (
                    <Tag color="red">{intl.formatMessage({ defaultMessage: '关闭' })}</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          </Collapse> */}
          {/* 测试功能 */}
          {/* <Modal
            centered
            open={testVisible}
            onCancel={() => setTestVisible(false)}
            destroyOnClose={true}
            width={'80%'}
            bodyStyle={{ height: '885px', overflow: 'auto' }}
            footer={null}
          >
            <div className={styles['redoc-container']}>
              {testVisible && content.customRest.oasFilepath && (
                <iframe
                  title="rapi"
                  src={`/#/rapi-frame?url=${content.customRest.oasFilepath ?? ''}`}
                  width={'100%'}
                  height={'100%'}
                  className="border-none"
                />
              )}
            </div>
          </Modal> */}
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
              onFinish={values => onFinish(values)}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger={['onBlur', 'onChange']}
              labelAlign="right"
              className="ml-3"
              initialValues={{
                ...content,
                headers: Object.keys(
                  content.customRest.headers || {}
                ).map<ApiDocuments.ConfigurationVariable>(key => {
                  const item = content.customRest.headers[key]
                  return {
                    key,
                    ...item.values[0]
                  }
                })
                // statusCodeUnions: content.customRest.statusCodeUnions,
                // secret: config.secret || { kind: '0' },
                // filePath: config.filePath || '',
                // tokenPoint: config.tokenPoint,
                // jwtType: config.jwtType
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
                  ...ruleMap.name
                ]}
                name="name"
                colon={false}
                style={{ marginBottom: '20px' }}
              >
                <Input
                  readOnly={!!content.name}
                  placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                />
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
                name={['customRest', 'oasFilepath']}
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
              <InputOrFromEnvWithItem
                formItemProps={{
                  label:
                    <>
                      <span>{intl.formatMessage({ defaultMessage: 'Rest 端点' })}</span>
                      <FormToolTip title={intl.formatMessage({ defaultMessage: 'Rest 端点' })} />
                    </>,
                  name: ['customRest', 'baseUrl'],
                  colon: false,
                  style: { marginBottom: '20px' }
                }}
                required
                inputRender={props => (
                  <AutoComplete
                    {...props}
                    options={baseURLOptions}
                    filterOption={(inputValue, option) => {
                      return true
                    }}
                    placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                  />
                )}
              />

              <div className="tabs-form">
                <Tabs defaultActiveKey="1" className="ml-3" onChange={onTabChange}>
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
                                  // rules={
                                  //   kind !== 1
                                  //     ? [
                                  //         {
                                  //           pattern: /^.{1,128}$/g,
                                  //           message: intl.formatMessage({
                                  //             defaultMessage: '请输入长度不大于128的非空值'
                                  //           })
                                  //         }
                                  //       ]
                                  //     : []
                                  // }
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
                                    src={`${import.meta.env.BASE_URL}assets/iconfont/guanbi.svg`}
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
              {/* <Collapse
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
              </Collapse> */}

              <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
                <div className="flex mt-10 w-160px justify-center items-center">
                  <Button
                    className={'btn-cancel  ml-4'}
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
                  {/*<Button*/}
                  {/*  className={'btn-test ml-4'}*/}
                  {/*  onClick={() => {*/}
                  {/*    test()*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  {intl.formatMessage({ defaultMessage: '测试' })}*/}
                  {/*</Button>*/}
                  <Button
                    className={'btn-save ml-4'}
                    onClick={() => form.submit()}
                    loading={loading}
                  >
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
