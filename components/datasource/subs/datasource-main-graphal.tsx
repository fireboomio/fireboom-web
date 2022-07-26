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
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'

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
interface DataType {
  reqHead: string
  reqType: string
  reqTypeInfo: string
}
interface PointSchema {
  name: string
  uid: string
  status: string
  url: string
}

const columns: ColumnsType<DataType> = [
  {
    title: '请求头',
    dataIndex: 'reqHead',
    key: 'reqHead',
    width: '27%',
  },
  {
    title: '类型',
    dataIndex: 'reqType',
    key: 'reqType',
    render: (reqType) => (
      <span>{reqType == 'value' ? '值' : reqType == 'client' ? '转发至客户端' : '环境变量'}</span>
    ),
    width: '20%',
  },
  {
    title: '请求头信息',
    dataIndex: 'reqHeadInfo',
    key: 'reqHeadInfo',
    width: '40%',
  },
]
export default function DatasourceGraphalMainCheck({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [file, setFile] = useImmer<UploadFile>({} as UploadFile)
  const [form] = Form.useForm()
  const { Option } = Select
  const { Panel } = Collapse
  const config = JSON.parse(content.config) as Config

  //表单提交成功回调
  const onFinish = async (values: Config) => {
    console.log('Success:', values)
    const newValues = { ...values }

    if ((values.schema as UploadFile[])?.length > 0) {
      await requests({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        url: '/dataSource/import',
        data: { file: file },
      })
      const upFile = (values.schema as UploadFile[])[0]
      newValues.schema = {
        name: upFile?.name,
        uid: upFile?.uid,
        status: 'done',
        url: '',
      } as unknown as ReactNode
    }

    await requests.put('/dataSource', { ...content, config: JSON.stringify(newValues) })
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
      dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 3) })
    })
    handleToggleDesigner('data', content.id)
  }

  //表单提交失败回调
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

  //开关切换回调 (查看页面的是否开启数据源开关)
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
    console.log('switch change')
  }

  //移除文件回调
  const onRemoveFile = (file: UploadFile) => {
    console.log(file, 'file')
  }

  if (!content) {
    return <></>
  }

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
                checked={content.switch == 1 ? true : false}
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
                width: '31%',
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
                <IconFont type="icon-wenjian1" /> {(config.schema as unknown as PointSchema)?.name}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <h2 className="ml-3 mb-3">请求头</h2>
          <Table
            columns={columns}
            rowKey="reqHead"
            dataSource={config.reqHeadAll as unknown as Array<DataType>}
            pagination={false}
            className="mb-10"
          />
          <Collapse
            ghost
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
                  colon={false}
                  column={1}
                  labelStyle={{
                    backgroundColor: 'white',
                    width: '31%',
                    borderRight: 'none',
                    borderBottom: 'none',
                    marginLeft: '10px',
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
                    {config.isInner ? <Tag color="green">开启</Tag> : <Tag color="red">关闭</Tag>}
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
                void onFinish(values as Config)
              }}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger="onBlur"
              className="ml-3"
              labelAlign="left"
              initialValues={{
                nameSpace: config.nameSpace,
                GraphqlPort: config.GraphqlPort,
                isInner: config.isInner,
                defineFloat: config.defineFloat,
                defineInt: config.defineInt,
                exceptRename: config.exceptRename,
                reqHeadAll: config.reqHeadAll,
              }}
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
              <Form.Item name="agreement" valuePropName="checked">
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
                  defaultFileList={config.schema ? [config.schema as unknown as UploadFile] : []}
                  onRemove={onRemoveFile}
                  beforeUpload={(file) => {
                    console.log(file, 'file')
                    setFile(file)
                    return false
                  }}
                >
                  <Button icon={<PlusOutlined />} className="w-147">
                    添加文件
                  </Button>
                </Upload>
              </Form.Item>
              <h2 className="ml-3 mb-3">请求头:</h2>

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
                    name="isInner"
                    colon={false}
                    style={{ marginBottom: '20px' }}
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
