import { CaretRightOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
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
  Upload,
  Collapse,
  Table,
  Tag,
  Modal,
} from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useContext, useEffect } from 'react'
import { RedocStandalone } from 'redoc'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceDispatchContext, DatasourceToggleContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './Rest.module.scss'

interface Props {
  content: DatasourceResp
  type: string
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

export default function DatasourceRestMain({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [form] = Form.useForm()
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const [testVisible, setTestVisible] = useImmer(false) //测试按钮蒙版
  const [value, setValue] = useImmer(1)
  const [deleteFlag, setDeleteFlag] = useImmer(false)
  const [file, setFile] = useImmer<UploadFile>({} as UploadFile)
  const [isRadioShow, setIsRadioShow] = useImmer(true)

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  const connectSwitchOnChange = (isChecked: boolean) => {
    void requests
      .put('/dataSource', {
        ...content,
        switch: isChecked == true ? 0 : 1,
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
          dispatch({ type: 'fetched', data: res })
        })
      })
  }

  if (!content) {
    return <></>
  }

  const config = JSON.parse(content.config) as Config

  const onChange = (key: string) => {
    console.log(key)
  }

  //密码显示与隐藏
  const changeEyeState = () => {
    setIsEyeShow(!isEyeShow)
  }

  //表单上传成功回调
  const onFinish = async (values: FromValues) => {
    console.log('Success:', values)
    values.headers = (values.headers as Array<DataType>)?.filter((item) => item.key != undefined)
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
      const req = { ...content, config: JSON.stringify(newValues), name: values.apiNameSpace }
      Reflect.deleteProperty(req, 'id')
      const result = await requests.post<unknown, number>('/dataSource', req)
      content.id = result
    } else
      await requests.put('/dataSource', {
        ...content,
        config: JSON.stringify(newValues),
        name: values.apiNameSpace,
      })

    void requests
      .get<unknown, DatasourceResp[]>('/dataSource')
      .then((res) => {
        dispatch({ type: 'fetched', data: res })
      })
      .then(() => {
        handleToggleDesigner('data', content.id)
      })
  }

  //表单上传失败回调
  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  //文件上传过程钩子
  const normFile = (e: UploadProps) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  //请求头授权Tab切换回调
  const onChangeTab = (key: string) => {
    console.log(key)
  }

  //单选框改变，表单变化回调
  const onChangeRadio = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

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
      {type === 'data' ? (
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
                className={`${styles['connect-check-btn-common']} w-16 ml-4`}
                onClick={() => {
                  setTestVisible(true)
                }}
              >
                <span>测试</span>
              </Button>
              <Button
                className={`${styles['edit-btn']} ml-4`}
                onClick={() => {
                  handleToggleDesigner('edit', content.id)
                }}
              >
                <span>编辑</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Descriptions
              bordered
              column={1}
              size="small"
              className={styles['descriptions-box']}
              labelStyle={{
                backgroundColor: 'white',
                width: '30.5%',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>名称</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.apiNameSpace}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>指定OAS</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                <IconFont type="icon-wenjian1" />
                {config.filePath}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab="请求头" key="1">
              <div className={`${styles['table-contain']}`}>
                <Table
                  bordered
                  showHeader={false}
                  columns={columns}
                  rowKey="key"
                  dataSource={(config.headers as unknown as Array<DataType>) || []}
                  pagination={false}
                  className="mb-10"
                />
              </div>
            </TabPane>
            <TabPane
              tab={
                <div>
                  <span className={styles['label-style']}>授权</span>
                  <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                </div>
              }
              key="2"
            >
              <div className="flex justify-center mb-11">
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  className={styles['descriptions-box']}
                  labelStyle={{
                    backgroundColor: 'white',
                    borderRight: 'none',
                    borderBottom: 'none',
                    width: '30%',
                    padding: '10px',
                    paddingLeft: '20px',
                  }}
                >
                  <Descriptions.Item label="JWT获取">
                    {config.jwtType == 1 ? '动态' : '静态'}
                  </Descriptions.Item>
                  <Descriptions.Item label="密钥">
                    {isEyeShow ? (
                      <div>
                        <span className="mr-5">{(config.secret as unknown as DataType)?.val}</span>
                        <IconFont type="icon-xiaoyanjing-chakan" onClick={changeEyeState} />
                      </div>
                    ) : (
                      <div>
                        <span className="mr-5">********</span>
                        <IconFont type="icon-xiaoyanjing-yincang" onClick={changeEyeState} />
                      </div>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="签名方法">{config.signingMethod}</Descriptions.Item>
                  <Descriptions.Item label="Token端点">{config.tokenPoint}</Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
          </Tabs>
          <Collapse
            ghost
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <IconFont type="icon-xiala" rotate={isActive ? 0 : -90} />
            )}
            className={`${styles['collapse-box']} site-collapse-custom-collapse bg-white-50`}
          >
            <Panel header="更多" key="1" className="site-collapse-custom-panel">
              <Descriptions
                colon={false}
                column={1}
                labelStyle={{
                  backgroundColor: 'white',
                  width: '31%',
                  borderRight: 'none',
                  borderBottom: 'none',
                  paddingLeft: '16px',
                }}
              >
                <Descriptions.Item
                  label={
                    <div>
                      <span className={styles['label-style']}>是否状态联合:</span>
                      <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                    </div>
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
            visible={testVisible}
            onCancel={() => setTestVisible(false)}
            destroyOnClose={true}
            width={'80%'}
            bodyStyle={{ height: '885px', overflow: 'auto' }}
            footer={null}
            closeIcon={<CloseOutlined className="mr-6" />}
          >
            <div className={styles['redoc-container']}>
              <RedocStandalone
                specUrl="http://petstore.swagger.io/v2/swagger.json"
                options={{
                  nativeScrollbars: true,
                  theme: { colors: { primary: { main: '#dd5522' } } },
                  disableSearch: false,
                }}
              />
            </div>
          </Modal>
        </>
      ) : (
        //编辑页面--------------------------------------------------------------------------
        <div>
          <div className="pb-9px flex items-center justify-between border-gray border-b">
            {content.name == '' ? (
              <div>
                <IconFont type="icon-shujuyuantubiao1" />
                <span className="ml-2">创建数据源</span>
              </div>
            ) : (
              <div>
                <IconFont type="icon-shujuyuantubiao1" />
                <span className="ml-2">
                  {content.name} <span className="text-xs text-gray-500/80">GET</span>
                </span>
              </div>
            )}

            <div className="flex justify-center items-center w-160px">
              <Button
                className={`${styles['connect-check-btn-common']} w-16 ml-4`}
                onClick={() => {
                  handleToggleDesigner('data', content.id, content.sourceType)
                }}
              >
                <span>取消</span>
              </Button>
              <Button
                className={`${styles['edit-btn']} ml-4`}
                onClick={() => {
                  form.submit()
                }}
              >
                {content.name == '' ? '创建' : '保存'}
              </Button>
            </div>
          </div>

          <div className="py-6 rounded-xl mb-4">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 11 }}
              onFinish={(values) => {
                void onFinish(values as Config)
              }}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger="onBlur"
              labelAlign="left"
              className="ml-3"
              initialValues={{
                apiNameSpace: config.apiNameSpace,
                headers: config.headers || [{ kind: '0' }],
                statusCodeUnions: config.statusCodeUnions,
                secret: config.secret || { kind: '0' },
              }}
            >
              <Form.Item
                label={
                  <div>
                    <span>名称:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                rules={[
                  { required: true, message: 'Please input nameSpace!' },
                  {
                    pattern: new RegExp('^\\w+$', 'g'),
                    message: '只允许包含数字，字母，下划线',
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
                  <div>
                    <span>指定OAS:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                name="filePath"
                valuePropName="fileList"
                style={{ marginBottom: '20px' }}
                getValueFromEvent={normFile}
              >
                <Upload
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
                    console.log(file, 'file')
                    const req = new RegExp('.json|.yaml', 'g')
                    if (req.test(file.name)) {
                      setFile(file)
                    } else {
                      file.status = 'error'
                    }
                    return false
                  }}
                  onRemove={onRemoveFile}
                >
                  <Button icon={<PlusOutlined />} className="w-159.5">
                    添加文件
                  </Button>
                </Upload>
              </Form.Item>

              <Tabs defaultActiveKey="1" onChange={onChangeTab} className="ml-3">
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
                                <Select>
                                  <Option value="0">值</Option>
                                  <Option value="1">环境变量</Option>
                                  <Option value="2">转发自客户端</Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                className="w-135"
                                wrapperCol={{ span: 24 }}
                                name={[field.name, 'val']}
                              >
                                <Input placeholder="请输入..." />
                              </Form.Item>
                              <IconFont
                                type="icon-guanbi"
                                onClick={() => {
                                  remove(index)
                                }}
                              />
                            </Space>
                          ))}

                          <Form.Item wrapperCol={{ span: 16 }}>
                            <Button
                              type="dashed"
                              onClick={() => {
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
                          <Form.Item
                            name={['secret', 'kind']}
                            noStyle
                            rules={[{ required: true, message: 'typeName is required' }]}
                          >
                            <Select className="w-1/5">
                              <Option value="0">值</Option>
                              <Option value="1">环境变量</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name={['secret', 'val']}
                            noStyle
                            rules={[
                              { required: true, message: '连接名不能为空' },
                              {
                                pattern: new RegExp('^\\w+$', 'g'),
                                message: '只允许包含字母，数字，下划线',
                              },
                            ]}
                          >
                            <Input style={{ width: '80%' }} placeholder="请输入" />
                          </Form.Item>
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
                          <Form.Item
                            name={['secret', 'kind']}
                            noStyle
                            rules={[{ required: true, message: 'typeName is required' }]}
                          >
                            <Select className="w-1/5">
                              <Option value="0">值</Option>
                              <Option value="1">环境变量</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name={['secret', 'val']}
                            noStyle
                            rules={[
                              { required: true, message: '连接名不能为空' },
                              {
                                pattern: new RegExp('^\\w+$', 'g'),
                                message: '只允许包含字母，数字，下划线',
                              },
                            ]}
                          >
                            <Input style={{ width: '80%' }} placeholder="请输入" />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                      <Form.Item
                        label={
                          <div>
                            <span>Token 端点:</span>
                            <IconFont
                              type="icon-wenhao"
                              className={`${styles['form-icon']} ml-1`}
                            />
                          </div>
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
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className="site-collapse-custom-collapse bg-light-50"
              >
                <Panel header="更多" key="1" className="site-collapse-custom-panel">
                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>是否状态联合:</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    name="statusCodeUnions"
                    colon={false}
                    style={{ marginBottom: '20px' }}
                    valuePropName="checked"
                  >
                    <Switch className={styles['switch-edit-btn']} size="small" />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Form>
          </div>
        </div>
      )}
    </>
  )
}
