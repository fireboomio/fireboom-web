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
} from 'antd'
import type { RadioChangeEvent, UploadFile, UploadProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
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
interface DataType {
  reqHead: string
  reqType: string
  reqTypeInfo: string
}
const columns: ColumnsType<DataType> = [
  {
    title: '请求头',
    dataIndex: 'reqHead',
    key: 'reqHead',
    width: '30%',
  },
  {
    title: '类型',
    dataIndex: 'reqType',
    key: 'reqType',
    render: (reqType) => (
      <span>{reqType == 'value' ? '值' : reqType == 'client' ? '转发至客户端' : '环境变量'}</span>
    ),
  },
  {
    title: '请求头信息',
    dataIndex: 'reqHeadInfo',
    key: 'reqHeadInfo',
  },
]

export default function DatasourceRestMainCheck({ content, type }: Props) {
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [value, setValue] = useImmer(1)
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
          dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 3) })
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
  const changeEyeState = () => {
    setIsEyeShow(!isEyeShow)
  }

  const onFinish = async (values: Config) => {
    console.log('Success:', values)
    const newValues = { ...config, ...values, theOAS: (values.theOAS as UploadFile[])[0]?.name }
    await requests.put('/dataSource', { ...content, config: JSON.stringify(newValues) })
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
      dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 2) })
    })
    handleToggleDesigner('data', content.id)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  const normFile = (e: UploadProps) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const onChangeTab = (key: string) => {
    console.log(key)
  }
  const onChangeRadio = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(e.target.value)
    setIsRadioShow(!isRadioShow)
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
                {config.nameScope}
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
                {config.endpoint}
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
                {config.theOAS}
                {/* {(config.theOAS as Array<UploadFile>)?.map((item) => {
                  return <div key={item.name}>{item.name}</div>
                })} */}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab="请求头" key="1">
              <Table
                columns={columns}
                rowKey="reqHead"
                dataSource={config.reqHeadAll as unknown as Array<DataType>}
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
                  <Descriptions.Item label="JWT获取">{config.getJWT}</Descriptions.Item>
                  <Descriptions.Item label="密钥">
                    {isEyeShow ? (
                      <div>
                        <span className="mr-5">{config.secretKey}</span>
                        <IconFont type="icon-xiaoyanjing-chakan" onClick={changeEyeState} />
                      </div>
                    ) : (
                      <div>
                        <span className="mr-5">********</span>
                        <IconFont type="icon-xiaoyanjing-yincang" onClick={changeEyeState} />
                      </div>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="签名方法">{config.signMethods}</Descriptions.Item>
                  <Descriptions.Item label="Token端点">{config.tokenPort}</Descriptions.Item>
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
                  {config.isUnite ? '是' : '否'}
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
            >
              <Form.Item
                label={
                  <div>
                    <span>命名空间:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                name="nameScope"
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
                required
                name="endpoint"
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
                name="theOAS"
                required
                valuePropName="fileList"
                style={{ marginBottom: '49px' }}
                getValueFromEvent={normFile}
              >
                <Upload method="post" action="/api/v1/dataSource/import">
                  <Button icon={<PlusOutlined />} className="w-147">
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
                    <Form.List name="reqHeadAll">
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <Space key={field.key} align="baseline">
                              <Form.Item
                                className="w-50"
                                wrapperCol={{ span: 24 }}
                                name={[field.name, 'reqHead']}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                className="w-36"
                                wrapperCol={{ span: 24 }}
                                name={[field.name, 'reqType']}
                                initialValue="value"
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
                                name={[field.name, 'reqHeadInfo']}
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
                  <Form.Item label="JWT获取" name="getJWT" initialValue={'静态'}>
                    <Radio.Group onChange={onChangeRadio} value={value}>
                      <Radio value={'静态'} className="mr-20">
                        静态
                      </Radio>
                      <Radio value={'动态'}>动态</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {isRadioShow ? (
                    <>
                      <Form.Item label="密钥" required>
                        <Form.Item
                          noStyle
                          rules={[{ required: true }]}
                          name="secretKeyType"
                          initialValue="value"
                        >
                          <Select style={{ width: '20%' }} placeholder="值">
                            <Option value="value">值</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item noStyle rules={[{ required: true }]} name="secretKey">
                          <Input style={{ width: '80%' }} placeholder="请输入..." />
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label="签名方法" name="signMethods" initialValue={'HS256'}>
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
                      name="tokenPort"
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
                    name="isUnite"
                    colon={false}
                    style={{ marginBottom: '20px' }}
                    rules={[{ required: true }]}
                    valuePropName="checked"
                    initialValue={true}
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
