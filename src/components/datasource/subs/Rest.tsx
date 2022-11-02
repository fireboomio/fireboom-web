import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import {
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
  Tag
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import FormToolTip from '@/components/common/FormTooltip'
import Error50x from '@/components/ErrorPage/50x'
import IconFont from '@/components/iconfont'
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
          <IconFont type="icon-zhi" className="text-[24px]" />
        ) : kind == '1' ? (
          <IconFont type="icon-shifoubixu2" className="text-[24px]" />
        ) : (
          <IconFont type="icon-biangeng1" className="text-[24px]" />
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
  const navigate = useNavigate()
  const { handleToggleDesigner, handleSave } = useContext(DatasourceToggleContext)
  const [form] = Form.useForm()
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const [testVisible, setTestVisible] = useImmer(false) //测试按钮蒙版
  const [value, setValue] = useImmer(1)
  const [rulesObj, setRulesObj] = useImmer({})
  const [isRadioShow, setIsRadioShow] = useImmer(true)
  const [isValue, setIsValue] = useImmer(true)

  const [envOpts, setEnvOpts] = useImmer<OptionT[]>([])
  const [envVal, setEnvVal] = useImmer('')

  const [visible, setVisible] = useImmer(false)

  // const [uploadPath, setUploadPath] = useState(BASEPATH)

  const setUploadPath = (v: string) => {
    form.setFieldValue('filePath', v)
    form.validateFields(['filePath'])
  }

  useEffect(() => {
    form.resetFields()
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
          pattern: /^[/\w]{1,128}$/g,
          message: '请输入长度不大于128的非空值'
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
          message: '以字母或下划线开头，只能由字母、下划线和数字组成'
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

    //创建新的item情况post请求，并将前端用于页面切换的id删除;编辑Put请求
    let newContent: DatasourceResp
    if (content.name == '' || content.name.startsWith('example_')) {
      const req = { ...content, config: newValues, name: values.apiNameSpace }
      Reflect.deleteProperty(req, 'id')
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
    void message.error('提交失败!')
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
        pattern: /^[/\w]{1,128}$/g,
        message: '请输入长度不大于128的非空值'
      })
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
        // closable={false}
      >
        <FileList
          basePath={BASEPATH}
          setUploadPath={setUploadPath}
          setVisible={setVisible}
          upType={1}
        />
      </Modal>

      {type === 'detail' ? (
        //查看页面--------------------------------------------------------------------------
        <>
          {/* <div className="border-gray border-b flex mb-8 pb-9px items-center justify-between">
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
              <Button className="ml-4 w-16 btn-light-border" onClick={() => setTestVisible(true)}>
                测试
              </Button>
              <Button
                className="ml-4 btn-light-full"
                onClick={() => handleToggleDesigner('form', content.id)}
              >
                编辑
              </Button>
            </div>
          </div> */}

          <div className="flex mb-8 justify-center">
            <Descriptions bordered column={1} size="small" className={styles['descriptions-box']}>
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>
                      名称 <FormToolTip title="名称" />
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
                      Rest 端点
                      <FormToolTip title="Rest 端点" />
                    </span>
                  </>
                }
                className="justify-start"
              >
                {config.baseURL}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <span className={styles['label-style']}>
                      指定 OAS
                      <FormToolTip title="指定OAS" />
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
            </Descriptions>
          </div>
          <div className="tabs-form">
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: '请求头',
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
                      授权
                      <FormToolTip title="授权" />
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
                        <Descriptions.Item label="签名方法">
                          {config.signingMethod}
                        </Descriptions.Item>
                        <Descriptions.Item label="Token端点">{config.tokenPoint}</Descriptions.Item>
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
            <Panel header="更多设置" key="1" className="site-collapse-custom-panel">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item
                  label={<span className={styles['label-style']}>是否状态联合</span>}
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
          <div className="border-gray border-b flex pb-9px items-center justify-between">
            {content.name == '' ? (
              <>
                <IconFont type="icon-shujuyuantubiao3" />
                <span className="ml-2">创建数据源</span>
              </>
            ) : (
              <>
                <IconFont type="icon-shujuyuantubiao3" />
                <span className="ml-2">
                  {content.name} <span className="text-xs text-gray-500/80">GET</span>
                </span>
              </>
            )}
          </div>

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
                    <span>命名空间</span>
                    <FormToolTip title="命名空间" />
                  </>
                }
                rules={[
                  { required: true, message: '请输入命名空间' },
                  {
                    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/g,
                    message: '以字母或下划线开头，只能由字母、下划线和数字组成'
                  }
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
                    <FormToolTip title="Rest 端点" />
                  </>
                }
                rules={[{ pattern: /^https?:\/\/[:.\w\d/]+$/g, message: '只允许输入链接' }]}
                name="baseURL"
                colon={false}
                style={{ marginBottom: '20px' }}
              >
                <Input placeholder="请输入..." />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: '请上传 OAS 文件' }]}
                label={
                  <>
                    <span>指定 OAS</span>
                    <FormToolTip title="指定OAS" />
                  </>
                }
                colon={false}
                name="filePath"
                // valuePropName="filePath"
                style={{ marginBottom: '20px' }}
                // getValueFromEvent={normFile}
              >
                <Input
                  placeholder="请输入..."
                  onClick={() => setVisible(true)}
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  suffix={<a onClick={() => setVisible(true)}>浏览</a>}
                  readOnly
                  // value={uploadPath}
                />
              </Form.Item>

              <div className="tabs-form">
                <Tabs defaultActiveKey="1" className="ml-3" onChange={onTabChange}>
                  <TabPane tab="请求头" key="1">
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
                                      <span className="h-full mr-1 inline-flex align-top items-center">
                                        {renderIcon('0')}
                                      </span>
                                      值
                                    </Option>
                                    <Option value="1">
                                      <span className="h-full mr-1 inline-flex align-top items-center">
                                        {renderIcon('1')}
                                      </span>
                                      环境变量
                                    </Option>
                                    <Option value="2">
                                      <span className="h-full mr-1 inline-flex align-top items-center">
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
                                  rules={
                                    form.getFieldValue(['headers', field.name, 'kind']) === '0'
                                      ? [
                                          {
                                            pattern: /^[/\w]{1,128}$/g,
                                            message: '请输入长度不大于128的非空值'
                                          }
                                        ]
                                      : []
                                  }
                                >
                                  {form.getFieldValue(['headers', field.name, 'kind']) === '0' ? (
                                    <Input style={{ width: '80%' }} placeholder="请输入" />
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
                                <IconFont type="icon-guanbi" onClick={() => remove(index)} />
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
                              <Form.Item name={['secret', 'val']} noStyle rules={[rulesObj]}>
                                <Input style={{ width: '80%' }} placeholder="请输入" />
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
                              <span>Token 端点</span>
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
                        <span className={styles['label-style']}>
                          是否状态联合
                          <FormToolTip title="是否状态联合" />
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

              <div className="flex mt-10 w-160px justify-center items-center">
                <Button className={'btn-save ml-4'} onClick={() => form.submit()}>
                  {content.name == '' ? '创建' : '保存'}
                </Button>
                <Button
                  className={'btn-cancel  ml-4'}
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
              </div>
            </Form>
          </div>
        </>
      )}
    </>
  )
}
