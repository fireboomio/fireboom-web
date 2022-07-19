import {
  CaretRightOutlined,
  QuestionCircleOutlined,
  EyeFilled,
  EyeInvisibleFilled,
  PlusOutlined,
} from '@ant-design/icons'
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
} from 'antd'
import type { RadioChangeEvent } from 'antd'
import { ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'

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

export default function DatasourceRestMainCheck({ content, type }: Props) {
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [value, setValue] = useImmer(1)
  const [form] = Form.useForm()
  const [isRadioShow, setIsRadioShow] = useImmer(true)

  const connectSwitchOnChange = () => {
    console.log('switch change')
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

  const onFinish = async (values: object) => {
    console.log('Success:', values)
    await requests.put('/dataSource', { ...content, config: JSON.stringify(values) })
    const datasource = await requests.get<unknown, DatasourceResp[]>('/dataSource')
    dispatch({
      type: 'fetched',
      data: datasource.filter((item) => item.source_type == 2),
    })
    handleToggleDesigner('data', content.id)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
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
        <>
          <div className="pb-17px flex items-center justify-between border-gray border-b mb-8">
            <div>
              <span className="ml-2">
                userinfo <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center">
              <Switch
                defaultChecked
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className={styles['switch-check-btn']}
              />
              <Button
                className={styles['edit-btn']}
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
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
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
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
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
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.theOAS}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab="请求头" key="1">
              <div className="flex justify-center mb-8">
                <Descriptions
                  bordered
                  column={3}
                  size="small"
                  className={styles['descriptions-box']}
                  labelStyle={{
                    backgroundColor: 'white',
                    borderRight: 'none',
                    borderBottom: 'none',
                  }}
                >
                  <Descriptions.Item>{config.head}</Descriptions.Item>
                  <Descriptions.Item>{config.way}</Descriptions.Item>
                  <Descriptions.Item>{config.code}</Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
            <TabPane
              tab={
                <div>
                  <span className={styles['label-style']}>授权</span>
                  <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                </div>
              }
              key="2"
            >
              <div className="flex justify-center ">
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
                  <Descriptions.Item label="JWT获取">{config.JWTget}</Descriptions.Item>
                  <Descriptions.Item label="密钥">
                    {isEyeShow ? (
                      <div>
                        <span className="mr-5">123456</span>
                        <EyeFilled onClick={changeEyeState} />
                      </div>
                    ) : (
                      <div>
                        <span className="mr-5">********</span>
                        <EyeInvisibleFilled onClick={changeEyeState} />
                      </div>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="签名方法">{config.signMethod}</Descriptions.Item>
                  <Descriptions.Item label="Token端点">{config.tokenPoint}</Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
          </Tabs>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className={`${styles['collapse-box']} site-collapse-custom-collapse bg-light-50`}
          >
            <Panel header="更多" key="1" className="site-collapse-custom-panel">
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
                        <span className={styles['label-style']}>是否状态联合</span>
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.isStateCombine}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Panel>
          </Collapse>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between border-gray border-b">
            <div>
              <span className="ml-2">
                {content.name} <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center mb-2">
              <Button className={styles['design-btn']}>
                <span>取消</span>
              </Button>
              <Button
                className={styles['edit-btn']}
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
                void onFinish(values as object)
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
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
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
                    <span>指定OAS:</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                name="theOAS"
                required
                valuePropName="fileList"
                style={{ marginBottom: '49px' }}
              >
                <Upload name="file" action="/upload.do" listType="picture">
                  <Button icon={<PlusOutlined />} className="w-147">
                    添加文件
                  </Button>
                </Upload>
              </Form.Item>
              <Tabs defaultActiveKey="1" onChange={onChangeTab} className="ml-3">
                <TabPane tab="请求头" key="1">
                  <Space style={{ display: 'flex' }} align="baseline">
                    <Form.Item className="w-50" wrapperCol={{ span: 24 }} name="reqHead">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      className="w-36"
                      wrapperCol={{ span: 24 }}
                      name="reqType"
                      initialValue="value"
                    >
                      <Select allowClear>
                        <Option value="value">值</Option>
                        <Option value="client">转发自客户端</Option>
                        <Option value="path">环境变量</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item className="w-190" wrapperCol={{ span: 12 }} name="reqHeadInfo">
                      <Input placeholder="请输入..." />
                    </Form.Item>
                  </Space>
                </TabPane>
                <TabPane
                  tab={
                    <div>
                      <span>授权</span>
                      <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                    </div>
                  }
                  key="2"
                >
                  <Form.Item label="JWT获取" name="getJWT">
                    <Radio.Group onChange={onChangeRadio} value={value} defaultValue={1}>
                      <Radio value={1} className="mr-20">
                        静态
                      </Radio>
                      <Radio value={2}>动态</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {isRadioShow ? (
                    <div>
                      <Form.Item label="密钥" required name="secretKey">
                        <Input.Group compact>
                          <Form.Item noStyle rules={[{ required: true }]}>
                            <Select style={{ width: '20%' }} placeholder="值">
                              1
                            </Select>
                          </Form.Item>
                          <Form.Item noStyle rules={[{ required: true }]}>
                            <Input style={{ width: '80%' }} placeholder="请输入..." />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                      <Form.Item label="签名方法" name="signMethods">
                        <Radio value={1} checked>
                          HS256
                        </Radio>
                      </Form.Item>
                    </div>
                  ) : (
                    <Form.Item
                      label={
                        <div>
                          <span>Token 端点:</span>
                          <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
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
                        <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
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
