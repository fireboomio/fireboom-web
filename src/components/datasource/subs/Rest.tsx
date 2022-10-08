import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Descriptions,
  Space,
  Button,
  Form,
  Input,
  Select,
  Radio,
  Switch,
  Tabs,
  Collapse,
  Table,
  Tag,
  message,
  Modal,
  Image,
} from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import FormToolTip from '@/components/common/FormTooltip'
import Uploader from '@/components/common/Uploader'
import IconFont from '@/components/iconfont'
import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import { DOMAIN } from '@/lib/common'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext,
} from '@/lib/context/datasource-context'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './Rest.module.scss'

interface Props {
  content: DatasourceResp
  type: ShowType
}

interface Config {
  [key: string]: string | undefined | number
}

interface FromValues {
  [key: string]: string | undefined | number | Array<DataType>
}

interface DataType {
  key: string
  kind: string
  val: string
}

const columns: ColumnsType<DataType> = [
  {
    dataIndex: 'key',
    width: '30%',
    render: (_, { key }) => <span className="pl-1">{key}</span>,
  },
  {
    dataIndex: 'val',
    width: '70%',
    render: (_, { kind, val }) => (
      <div className="flex items-center">
        {kind == '0' ? (
          <IconFont type="icon-zhi" className="text-[24px]" />
        ) : kind == '1' ? (
          <IconFont type="icon-shifoubixu2" className="text-[24px]" />
        ) : (
          <IconFont type="icon-biangeng1" className="text-[24px]" />
        )}
        <span className="ml-2">{val}</span>
      </div>
    ),
  },
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
        2: '/assets/header-relay.png',
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
export default function Rest({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [form] = Form.useForm()
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const [testVisible, setTestVisible] = useImmer(false) //测试按钮蒙版
  const [value, setValue] = useImmer(1)
  const [deleteFlag, setDeleteFlag] = useImmer(false)
  const [rulesObj, setRulesObj] = useImmer({})
  const [file, setFile] = useImmer<UploadFile>({} as UploadFile)
  const [isRadioShow, setIsRadioShow] = useImmer(true)
  const [isValue, setIsValue] = useImmer(true)

  const [envOpts, setEnvOpts] = useImmer<OptionT[]>([])
  const [envVal, setEnvVal] = useImmer('')

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  useEffect(() => {
    if (window && document) {
      const script = document.createElement('script')
      const body = document.getElementsByTagName('body')[0]
      script.src = '//unpkg.com/rapidoc/dist/rapidoc-min.js'
      body.appendChild(script)
    }
  }, [])

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
        switch: isChecked == true ? 0 : 1,
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
          dispatch({ type: 'fetched', data: res })
        })
      })
  }

  if (!content) {
    return <Error50x />
  }

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
          pattern: /^\w{1,128}$/g,
          message: '请输入长度不大于128的非空值',
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
          message: '以字母或下划线开头，只能由字母、下划线和数字组成',
        })
        return
      default:
        return
    }
  }

  //表单上传成功回调
  const onFinish = async (values: FromValues) => {
    values.headers = (values.headers as Array<DataType>)?.filter(item => item.key != undefined)
    const newValues = { ...values }
    const index = (config.filePath as string)?.lastIndexOf('/')
    const fileId = (config.filePath as string)?.substring(index + 1) //获取文件id

    //如果进行上传文件操作
    if (file.uid) {
      //如果存在已经上传文件 先删除先前文件
      if (config.filePath) {
        await requests({
          method: 'post',
          url: '/dataSource/removeFile',
          data: { id: fileId },
        })
      }
      newValues.filePath = (await requests({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        url: '/dataSource/import',
        data: { file: file },
      })) as unknown as string
    } else {
      //如果删除文件则将config中的filePath置空
      if (deleteFlag) {
        await requests({
          method: 'post',
          url: '/dataSource/removeFile',
          data: { id: fileId },
        })
        newValues.filePath = undefined
      } else newValues.filePath = config.filePath //如果没有进行上传文件操作，且没有删除文件，将原本的文件路径保存
    }

    //创建新的item情况post请求，并将前端用于页面切换的id删除;编辑Put请求
    if (content.name == '') {
      const req = { ...content, config: newValues, name: values.apiNameSpace }
      Reflect.deleteProperty(req, 'id')
      const result = await requests.post<unknown, number>('/dataSource', req)
      content.id = result
    } else
      await requests.put('/dataSource', {
        ...content,
        config: newValues,
        name: values.apiNameSpace,
      })

    void requests
      .get<unknown, DatasourceResp[]>('/dataSource')
      .then(res => {
        dispatch({ type: 'fetched', data: res })
      })
      .then(() => {
        handleToggleDesigner('detail', content.id)
      })
  }

  //表单上传失败回调
  const onFinishFailed = (errorInfo: object) => {
    void message.error('提交失败!')
    throw errorInfo
  }

  //文件上传过程钩子
  const normFile = (e: UploadProps) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  //单选框改变，表单变化回调
  const onChangeRadio = (e: RadioChangeEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(e.target.value)
    setIsRadioShow(!isRadioShow)
  }

  //文件移除回调
  const onRemoveFile = () => {
    setDeleteFlag(true)
    setFile({} as unknown as UploadFile)
  }

  const { TabPane } = Tabs
  const { Option } = Select
  const { Panel } = Collapse
  return (
    <>
      {type === 'detail' ? (
        //查看页面--------------------------------------------------------------------------
        <>
          <div className="pb-9px flex items-center justify-between border-gray border-b mb-8">
            <div>
              <IconFont type="icon-shujuyuantubiao1" />
              <span className="ml-2">
                {content.name} <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center">
              <Switch
                checked={content.switch == 0 ? true : false}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className={styles['switch-check-btn']}
              />
              <Button
                className="btn-light-border w-16 ml-4"
                onClick={() => setTestVisible(true)}
              >
                测试
              </Button>
              <Button
                className="btn-light-full ml-4"
                onClick={() => handleToggleDesigner('form', content.id)}
              >
                编辑
              </Button>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Descriptions
              bordered
              column={1}
              size="small"
              className={styles['descriptions-box']}
            >
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>名称 <FormToolTip title="test" /></span>
                  </>
                }
                className="justify-start"
              >
                {config.apiNameSpace}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>Rest 端点<FormToolTip title="test" /></span>
                  </>
                }
                className="justify-start"
              >
                {config.baseUrl}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>指定OAS<FormToolTip title="test" /></span>
                  </>
                }
              >
                <div className="flex items-center">
                  <Image src="/assets/upload-file.png" width={14} height={14} alt="文件" preview={false}/>
                  <span className="text-11px text-[#909399] ml-2">{config.filePath}</span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="tabs-form">
            <Tabs defaultActiveKey="1">
              <TabPane tab="请求头" key="1">
                <Descriptions
                  className="mb-8"
                  bordered
                  column={1}
                  size="small"
                  labelStyle={{
                    width: 190,
                  }}
                >
                  {((config?.headers as unknown as DataType[]) ?? []).map(
                    ({ key = '', kind = '', val = '' }) => (
                      <Descriptions.Item
                        key={key}
                        label={
                          <div>
                        <span className={styles['label-style']}>
                          {key}
                          <FormToolTip title="test" />
                        </span>
                          </div>
                        }
                        className="justify-start"
                        style={{ wordBreak: 'break-all' }}
                      >
                        <div className="flex items-center">
                          <div className="text-0px">{renderIcon(kind)}</div>
                          <div className="flex-1 min-w-0 ml-2">{val}</div>
                        </div>
                      </Descriptions.Item>
                    )
                  )}
                </Descriptions>
              </TabPane>
              <TabPane
                tab={
                  <>
                    <span className={styles['label-style']}>授权<FormToolTip title="test" /></span>
                  </>
                }
                key="2"
              >
                <div className="flex justify-center mb-11">
                  <Descriptions
                    bordered
                    column={1}
                    size="small"
                    className={styles['descriptions-box']}
                  >
                    <Descriptions.Item label="JWT获取">
                      {config.jwtType == 1 ? '动态' : '静态'}
                    </Descriptions.Item>
                    <Descriptions.Item label="密钥">
                      {isEyeShow ? (
                        <>
                          <span className="mr-5">
                            {(config.secret as unknown as DataType)?.val}
                          </span>
                          <IconFont type="icon-xiaoyanjing-chakan" onClick={changeEyeState} />
                        </>
                      ) : (
                        <>
                          <span className="mr-5">********</span>
                          <IconFont type="icon-xiaoyanjing-yincang" onClick={changeEyeState} />
                        </>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="签名方法">{config.signingMethod}</Descriptions.Item>
                    <Descriptions.Item label="Token端点">{config.tokenPoint}</Descriptions.Item>
                  </Descriptions>
                </div>
              </TabPane>
            </Tabs>
          </div>
          <Collapse
            ghost
            bordered={false}
            defaultActiveKey={['0']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className={`${styles['collapse-box']} site-collapse-custom-collapse bg-white-50`}
          >
            <Panel header="更多设置" key="1" className="site-collapse-custom-panel">
              <Descriptions
                bordered
                column={1}
                size="small"
              >
                <Descriptions.Item
                  label={
                    <>
                      <span className={styles['label-style']}>是否状态联合</span>
                    </>
                  }
                  className="justify-start"
                >
                  {config.statusCodeUnions ? (
                    <Tag color="green">开启</Tag>
                  ) : (
                    <Tag color="red">关闭</Tag>
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
              {/* @ts-ignore */}
              <rapi-doc
                spec-url={`//${DOMAIN}/static/upload/oas/${config.filePath ?? ''}`}
                show-header="false"
                show-info="false"
                allow-authentication="false"
                allow-server-selection="false"
                allow-api-list-style-selection="false"
                render-style="read"
              />
            </div>
          </Modal>
        </>
      ) : (
        //编辑页面--------------------------------------------------------------------------
        <>
          <div className="pb-9px flex items-center justify-between border-gray border-b">
            {content.name == '' ? (
              <>
                <IconFont type="icon-shujuyuantubiao1" />
                <span className="ml-2">创建数据源</span>
              </>
            ) : (
              <>
                <IconFont type="icon-shujuyuantubiao1" />
                <span className="ml-2">
                  {content.name} <span className="text-xs text-gray-500/80">GET</span>
                </span>
              </>
            )}

          </div>

          <div className="py-6 rounded-xl mb-4">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 11 }}
              onFinish={values => void onFinish(values as Config)}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger={['onBlur', 'onChange']}
              labelAlign="right"
              className="ml-3"
              initialValues={{
                apiNameSpace: config.apiNameSpace,
                baseUrl: config.baseUrl,
                headers: config.headers || [],
                statusCodeUnions: config.statusCodeUnions,
                secret: config.secret || { kind: '0' },
              }}
            >
              <Form.Item
                label={
                  <>
                    <span>命名空间</span>
                    <FormToolTip title="test" />
                  </>
                }
                rules={[
                  { required: true, message: '请输入命名空间' },
                  {
                    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/g,
                    message: '以字母或下划线开头，只能由字母、下划线和数字组成',
                  },
                ]}
                name="apiNameSpace"
                colon={false}
                style={{ marginBottom: '20px' }}
              >
                <Input placeholder="请输入..." />
              </Form.Item>
              <Form.Item
                label={
                  <>
                    <span>Rest 端点</span>
                    <FormToolTip title="test" />
                  </>
                }
                rules={[
                  {
                    pattern: /^https?:\/\/[.\w\d/]+$/g,
                    message: '只允许输入链接',
                  },
                ]}
                name="baseUrl"
                colon={false}
                style={{ marginBottom: '20px' }}
              >
                <Input placeholder="请输入..." />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: '请上传 OAS 文件' }]}
                label={
                  <>
                    <span>指定OAS:</span>
                    <FormToolTip title="test" />
                  </>
                }
                colon={false}
                name="filePath"
                valuePropName="fileList"
                style={{ marginBottom: '20px' }}
                getValueFromEvent={normFile}
              >
                <Uploader
                  defaultFileList={
                    (config.filePath as string)
                      ? [
                          {
                            name: config.filePath as unknown as string,
                            uid: config.filePath as unknown as string,
                          },
                        ]
                      : []
                  }
                  maxCount={1}
                  beforeUpload={(file: UploadFile) => {
                    const req = new RegExp('.json|.yaml', 'g')
                    if (req.test(file.name)) {
                      setFile(file)
                    } else {
                      file.status = 'error'
                    }
                    return false
                  }}
                  onRemove={onRemoveFile}
                 />
              </Form.Item>

              <div className="tabs-form">
                <Tabs defaultActiveKey="1" className="ml-3">
                  <TabPane tab="请求头" key="1">
                    <Form.Item
                      wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 24 },
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
                                <span className="mr-1 inline-flex align-top h-full items-center">
                                  {renderIcon('0')}
                                </span>
                                      值
                                    </Option>
                                    <Option value="1">
                                <span className="mr-1 inline-flex align-top h-full items-center">
                                  {renderIcon('1')}
                                </span>
                                      环境变量
                                    </Option>
                                    <Option value="2">
                                <span className="mr-1 inline-flex align-top h-full items-center">
                                  {renderIcon('2')}
                                </span>
                                      转发自客户端
                                    </Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  className="w-135"
                                  wrapperCol={{ span: 24 }}
                                  name={[field.name, 'val']}
                                  rules={[rulesObj]}
                                >
                                  {isValue ? (
                                    <Input style={{ width: '80%' }} placeholder="请输入" />
                                  ) : (
                                    <Select className="w-1/5" style={{ width: '80%' }}>
                                      <Option value="1">1</Option>
                                      <Option value="2">2</Option>
                                    </Select>
                                  )}
                                </Form.Item>
                                <IconFont type="icon-guanbi" onClick={() => remove(index)} />
                              </Space>
                            ))}

                            <Form.Item wrapperCol={{ span: 16 }}>
                              <Button
                                type="dashed"
                                onClick={() => add({ kind: '0' })}
                                icon={<PlusOutlined />}
                                className="text-gray-500/60 w-1/1"
                              >
                                新增请求头信息
                              </Button>
                              <Form.ErrorList errors={errors} />
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </TabPane>
                  <TabPane
                    tab={
                      <div>
                        <span>授权</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    key="2"
                  >
                    <Form.Item label="JWT获取" name="jwtType" initialValue={'0'}>
                      <Radio.Group onChange={onChangeRadio} value={value}>
                        <Radio value={'0'} className="mr-20">
                          静态
                        </Radio>
                        <Radio value={'1'}>动态</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {isRadioShow ? (
                      <>
                        <Form.Item label="密钥">
                          <Input.Group compact>
                            <Form.Item name={['secret', 'kind']} noStyle>
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

                        <Form.Item label="签名方法" name="signingMethod" initialValue={'HS256'}>
                          <Radio value={'HS256'} checked>
                            HS256
                          </Radio>
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <Form.Item label="密钥">
                          <Input.Group compact>
                            <Form.Item name={['secret', 'kind']} noStyle>
                              <Select className="w-1/5" onChange={onValueChange}>
                                <Option value="0">值</Option>
                                <Option value="1">环境变量</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item name={['secret', 'val']} noStyle rules={[rulesObj]}>
                              {isValue ? (
                                <Input style={{ width: '80%' }} placeholder="请输入" />
                              ) : (
                                <Select className="w-1/5" style={{ width: '80%' }}>
                                  <Option value="1">1</Option>
                                  <Option value="2">2</Option>
                                </Select>
                              )}
                            </Form.Item>
                          </Input.Group>
                        </Form.Item>
                        <Form.Item
                          label={
                            <>
                              <span>Token 端点:</span>
                              <IconFont
                                type="icon-wenhao"
                                className={`${styles['form-icon']} ml-1`}
                              />
                            </>
                          }
                          colon={false}
                          required
                          style={{ marginBottom: '20px' }}
                          name="tokenPoint"
                        >
                          <Input placeholder="请输入..." />
                        </Form.Item>
                      </>
                    )}
                  </TabPane>
                </Tabs>
              </div>
              <Collapse
                ghost
                bordered={false}
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              >
                <Panel header="更多" key="1" className="site-collapse-custom-panel">
                  <Form.Item
                    label={
                      <>
                        <span className={styles['label-style']}>是否状态联合<FormToolTip title="test" /></span>
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

              <div className="flex justify-center items-center w-160px mt-10">
                <Button className={'btn-save ml-4'} onClick={() => form.submit()}>
                  {content.name == '' ? '创建' : '保存'}
                </Button>
                <Button
                  className={'btn-cancel  ml-4'}
                  onClick={() => handleToggleDesigner('detail', content.id, content.sourceType)}
                >
                  <span>取消</span>
                </Button>
              </div>
            </Form>
          </div>
        </>
      )}
    </>
  )
}
