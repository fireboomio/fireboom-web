import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Switch,
  Descriptions,
  Collapse,
  Form,
  Input,
  Checkbox,
  Upload,
  Space,
  Select,
} from 'antd'
import type { UploadProps, UploadFile } from 'antd'
import { ReactNode, useContext } from 'react'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext, DatasourceDispatchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './datasource-common.module.scss'

interface Props {
  content: DatasourceResp
  type: string
}
interface Config {
  [key: string]: ReactNode
}

export default function DatasourceGraphalMainCheck({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [form] = Form.useForm()
  const { Option } = Select
  const { Panel } = Collapse
  const config = JSON.parse(content.config) as Config

  const onFinish = async (values: object) => {
    console.log('Success:', values)
    const newValues = { ...config, ...values }
    await requests.put('/dataSource', { ...content, config: JSON.stringify(newValues) })
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
      dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 3) })
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

  const connectSwitchOnChange = () => {
    console.log('switch change')
  }

  if (!content) {
    return <></>
  }
  console.log(config)
  return (
    <>
      {type === 'data' ? (
        //查看页面--------------------------------------------------------------------------
        //查看页面--------------------------------------------------------------------------
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
              <div className="w-160px">
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
                    <span className={styles['label-style']}>Graphql 端点</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.GraphqlPort}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>指定Schema</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {(config.schema as Array<UploadFile>)?.map((item) => {
                  return <div key={item.name}>{item.name}</div>
                })}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <h2 className="ml-3 mb-3">请求头</h2>
          <div className="flex justify-center mb-8">
            <Descriptions
              bordered
              column={3}
              size="small"
              className={styles['descriptions-box']}
              layout="vertical"
              labelStyle={{
                backgroundColor: 'white',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item label="请求头" style={{ width: '30%' }}>
                {config.reqHead}
              </Descriptions.Item>
              <Descriptions.Item label="请求头类型" style={{ width: '20%' }}>
                {config.reqType == 'value'
                  ? '值'
                  : config.reqType == 'client'
                  ? '转发至客户端'
                  : '环境变量'}
              </Descriptions.Item>
              <Descriptions.Item label="请求头信息" style={{ width: '50%' }}>
                {config.reqHeadInfo}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <IconFont type="icon-xiala" rotate={isActive ? 0 : -90} />
            )}
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
                        <span className={styles['label-style']}>是否内部</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.isInner ? '是' : '否'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>自定义Float标量</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.defineFloat}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>自定义INT标量</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.defineInt}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>排除重命名根字段</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.exceptRename}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Panel>
          </Collapse>
        </>
      ) : (
        //编辑页面--------------------------------------------------------------------------
        //编辑页面--------------------------------------------------------------------------
        <>
          <div className="flex items-center justify-between border-gray border-b">
            <div>
              <span className="ml-2">
                {content.name} <span className="text-xs text-gray-500/80">GET</span>
              </span>
            </div>
            <div className="flex justify-center items-center mb-2 w-160px">
              <Button
                className={`${styles['connect-check-btn-common']} w-16 ml-4`}
                onClick={() => {
                  handleToggleDesigner('data', content.id)
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
                <span>保存</span>
              </Button>
            </div>
          </div>

          <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 11 }}
              onFinish={(values) => {
                void onFinish(values as object)
              }}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger="onBlur"
              className="ml-3"
              labelAlign="left"
            >
              <Form.Item
                label={
                  <div className="">
                    <span className={styles['label-style']}>命名空间:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                style={{ marginBottom: '20px' }}
                name="nameSpace"
              >
                <Input placeholder="请输入..." />
              </Form.Item>

              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>Graphql 端点:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                required
                style={{ marginBottom: '20px' }}
                name="GraphqlPort"
              >
                <Input placeholder="请输入..." />
              </Form.Item>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('')),
                  },
                ]}
              >
                <Checkbox>通过发送指令,自动内省Schema</Checkbox>
              </Form.Item>
              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>指定Schema:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                name="schema"
                required
                valuePropName="fileList"
                style={{ marginBottom: '48px' }}
                getValueFromEvent={normFile}
              >
                <Upload
                  name="file"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture"
                >
                  <Button icon={<PlusOutlined />} className="w-147">
                    添加文件
                  </Button>
                </Upload>
              </Form.Item>
              <h2 className="ml-3 mb-3">请求头</h2>
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item className="w-60" name="reqHead" wrapperCol={{ span: 24 }}>
                  <Input />
                </Form.Item>
                <Form.Item
                  className="w-33"
                  name="reqType"
                  wrapperCol={{ span: 24 }}
                  initialValue="value"
                >
                  <Select allowClear>
                    <Option value="value">值</Option>
                    <Option value="client">转发自客户端</Option>
                    <Option value="path">环境变量</Option>
                  </Select>
                </Form.Item>
                <Form.Item className="w-235" name="reqHeadInfo" wrapperCol={{ span: 12 }}>
                  <Input placeholder="请输入..." />
                </Form.Item>
              </Space>

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
                        <span className={styles['label-style']}>是否内部:</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    valuePropName="checked"
                    initialValue={false}
                    name="isInner"
                    colon={false}
                    style={{ marginBottom: '20px' }}
                    rules={[{ required: true }]}
                  >
                    <Switch className={styles['switch-edit-btn']} size="small" />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div className="">
                        <span className={styles['label-style']}>自定义Float标量:</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    name="defineFloat"
                    colon={false}
                    style={{ marginBottom: '20px' }}
                  >
                    <Input placeholder="请输入..." />
                  </Form.Item>

                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>自定义INT标量:</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    name="defineInt"
                    colon={false}
                    required
                    style={{ marginBottom: '20px' }}
                  >
                    <Input placeholder="请输入..." />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>排除重命名根字段:</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    colon={false}
                    required
                    style={{ marginBottom: '20px' }}
                    name="exceptRename"
                  >
                    <Input placeholder="请输入..." />
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
