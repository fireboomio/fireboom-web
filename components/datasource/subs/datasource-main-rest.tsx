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
  Upload,
  Collapse,
  Table,
  Tag,
} from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceDispatchContext, DatasourceToggleContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './datasource-common.module.scss'

interface Props {
  content: DatasourceResp
  type: string
}

interface Config {
  [key: string]: ReactNode
}
interface theOAS {
  name: string
  uid: string
  status: string
  url: string
}
interface DataType {
  Kay: string
  Kind: string
  Val: string
}

const columns: ColumnsType<DataType> = [
  {
    title: '请求头',
    dataIndex: 'Kay',
    key: 'Kay',
    width: '27%',
  },
  {
    title: '类型',
    dataIndex: 'Kind',
    key: 'Kind',
    render: (Kind) => (
      <span>{Kind == 'value' ? '值' : Kind == 'client' ? '转发至客户端' : '环境变量'}</span>
    ),
    width: '20%',
  },
  {
    title: '请求头信息',
    dataIndex: 'Val',
    key: 'Val',
    width: '40%',
  },
]

export default function DatasourceRestMainCheck({ content, type }: Props) {
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [value, setValue] = useImmer(1)
  const [file, setFile] = useImmer<UploadFile>({} as UploadFile)
  const [form] = Form.useForm()
  const [isRadioShow, setIsRadioShow] = useImmer(true)

  const connectSwitchOnChange = (isChecked: boolean) => {
    void requests
      .put('/dataSource', {
        ...content,
        switch: isChecked == true ? 1 : 0,
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
          dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 2) })
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
  const onFinish = async (values: Config) => {
    console.log('Success:', values)
    const newValues = { ...values }
    // const m = new Map()
    // (newValues.reqHeadAll as unknown as ).forEach(element => {
    // });
    // console.dir(m, 'm')

    if ((values.filePath as UploadFile[])?.length > 0) {
      await requests({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        url: '/dataSource/import',
        data: { file: file },
      })
      const upFile = (values.filePath as UploadFile[])[0]
      newValues.filePath = {
        name: upFile?.name,
        uid: upFile?.uid,
        status: 'done',
        url: '',
      } as unknown as ReactNode
    }
    await requests.put('/dataSource', { ...content, config: JSON.stringify(newValues) })
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
      dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 2) })
    })
    handleToggleDesigner('data', content.id)
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
  const onRemoveFile = (file: UploadFile) => {
    console.log(file, 'file')
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
              <span className="ml-2">
                userinfo <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center">
              <Switch
                checked={content.switch == 1 ? true : false}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className={styles['switch-check-btn']}
              />
              <Button className={`${styles['connect-check-btn-common']} w-16 ml-4`}>
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
                width: '30%',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>命名空间</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.nameSpace}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>Rest 端点</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.restPoint}
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
                {(config.filePath as unknown as theOAS)?.name}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Tabs defaultActiveKey="1" onChange={onChange}>
            {/* header:["k1":{kind:"1",Val:'123'},"k2":{}] */}
            <TabPane tab="请求头" key="1">
              <Table
                columns={columns}
                rowKey="Kay"
                dataSource={config.header as unknown as Array<DataType>}
                pagination={false}
                className="mb-10"
              />
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
              <div className="flex justify-center">
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
                  }}
                >
                  <Descriptions.Item label="JWT获取">{config.jwtType}</Descriptions.Item>
                  <Descriptions.Item label="密钥">
                    {isEyeShow ? (
                      <div>
                        <span className="mr-5">{(config.secret as unknown as DataType)?.Val}</span>
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
        </>
      ) : (
        //编辑页面--------------------------------------------------------------------------
        <>
          <div className="flex items-center justify-between border-gray border-b">
            <div>
              <span className="ml-2">
                {content.name} <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center mb-2 w-160px">
              <Button className={`${styles['connect-check-btn-common']} w-16 ml-4`}>
                <span>取消</span>
              </Button>
              <Button
                className={`${styles['edit-btn']} ml-4`}
                onClick={() => {
                  form.submit()
                }}
              >
                <span>保存</span>
              </Button>
            </div>
          </div>

          <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
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
                nameSpace: config.nameSpace,
                restPoint: config.restPoint,
                header: config.header,
                statusCodeUnions: config.statusCodeUnions,
                secret: config.secret,
              }}
            >
              <Form.Item
                label={
                  <div>
                    <span>命名空间:</span>
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
                name="nameSpace"
                colon={false}
                style={{ marginBottom: '20px' }}
              >
                <Input placeholder="请输入..." />
              </Form.Item>
              <Form.Item
                label={
                  <div>
                    <span>Rest 端点:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                rules={[
                  { required: true, message: 'Please input RestPort!' },
                  {
                    pattern: new RegExp('^\\w+$', 'g'),
                    message: '只允许包含数字，字母，下划线',
                  },
                ]}
                name="restPoint"
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
                  defaultFileList={config.theOAS ? [config.theOAS as unknown as UploadFile] : []}
                  beforeUpload={(file) => {
                    console.log(file, 'file')
                    setFile(file)
                    return false
                  }}
                  onRemove={onRemoveFile}
                >
                  <Button icon={<PlusOutlined />} className="w-148.5">
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
                    <Form.List name="header">
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <Space key={field.key} align="baseline">
                              <Form.Item
                                className="w-50"
                                wrapperCol={{ span: 24 }}
                                name={[field.name, 'Kay']}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                className="w-36"
                                wrapperCol={{ span: 24 }}
                                name={[field.name, 'Kind']}
                              >
                                <Select>
                                  <Option value="value">值</Option>
                                  <Option value="client">转发自客户端</Option>
                                  <Option value="path">环境变量</Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                className="w-126"
                                wrapperCol={{ span: 24 }}
                                name={[field.name, 'Val']}
                              >
                                <Input placeholder="请输入..." />
                              </Form.Item>
                              <IconFont
                                type="icon-guanbi"
                                className={`${styles['form-delete-icon']}`}
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
                                add()
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
                  {/* 0静态1动态 */}
                  <Form.Item label="JWT获取" name="jwtType" initialValue={'静态'}>
                    <Radio.Group onChange={onChangeRadio} value={value}>
                      <Radio value={'静态'} className="mr-20">
                        静态
                      </Radio>
                      <Radio value={'动态'}>动态</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {isRadioShow ? (
                    <>
                      {/* type Value struct {
   Kind int64  `json:"kind"` // 0-值 1-环境变量 2-转发值客户端
   Val  string `json:"val"`
} */}
                      <Form.Item label="密钥">
                        <Input.Group compact>
                          <Form.Item
                            name={['secret', 'Kind']}
                            noStyle
                            rules={[{ required: true, message: 'typeName is required' }]}
                          >
                            <Select className="w-1/5">
                              <Option value="value">值</Option>
                              <Option value="path">环境变量</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name={['secret', 'Val']}
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
                    <Form.Item
                      label={
                        <div>
                          <span>Token 端点:</span>
                          <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                        </div>
                      }
                      colon={false}
                      required
                      style={{ marginBottom: '20px' }}
                      name="tokenPoint"
                    >
                      <Input placeholder="请输入..." />
                    </Form.Item>
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
        </>
      )}
    </>
  )
}
