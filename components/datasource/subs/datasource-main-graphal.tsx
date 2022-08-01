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
import { ReactNode, useContext, useEffect } from 'react'
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
  key: string
  kind: string
  val: string
}

const columns: ColumnsType<DataType> = [
  {
    dataIndex: 'key',
    key: 'key',
    width: '30%',
    render: (_, { key }) => <span className="pl-1">{key}</span>,
  },
  {
    dataIndex: 'val',
    key: 'val',
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
export default function DatasourceGraphalMainCheck({ content, type }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [file, setFile] = useImmer<UploadFile>({} as UploadFile)
  const [deleteFlag, setDeleteFlag] = useImmer(false)
  const [isShowUpSchema, setIsShowUpSchema] = useImmer(true)
  const [form] = Form.useForm()
  const { Option } = Select
  const { Panel } = Collapse
  const config = JSON.parse(content.config) as Config

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  //表单提交成功回调
  const onFinish = async (values: Config) => {
    console.log('SuccessValues:', values)
    const newValues = { ...values }
    if (file.uid) {
      if (config.loadSchemaFromString) {
        await requests({
          method: 'delete',
          url: '/file',
          data: { id: config.loadSchemaFromString },
        })
      }
      newValues.loadSchemaFromString = (await requests({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        url: '/file/upload',
        data: { file: file },
      })) as unknown as string
    } else {
      if (deleteFlag) {
        await requests({
          method: 'delete',
          url: '/file',
          data: { id: config.loadSchemaFromString },
        })
        newValues.loadSchemaFromString = undefined
      } else newValues.loadSchemaFromString = config.loadSchemaFromString
    }
    if (content.name == '') {
      const req = { ...content, config: JSON.stringify(newValues), name: values.nameSpace }
      Reflect.deleteProperty(req, 'id')
      const result = await requests.post<unknown, number>('/dataSource', req)
      content.id = result
    } else
      await requests.put('/dataSource', {
        ...content,
        config: JSON.stringify(newValues),
        name: values.nameSpace,
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

  //表单提交失败回调
  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
    console.log('123')
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
          dispatch({ type: 'fetched', data: res })
        })
      })
    console.log('switch change')
  }

  //移除文件回调
  const onRemoveFile = () => {
    setDeleteFlag(true)
    setFile({} as unknown as UploadFile)
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
          <div className="pb-9px flex items-center justify-between border-gray border-b mb-8">
            <div>
              <IconFont type="icon-shujuyuantubiao1" />
              <span className="ml-2">
                {content.name} <span className="text-xs text-gray-500/80">GET</span>
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
                {config.url}
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
                <IconFont type="icon-wenjian1" /> {config.loadSchemaFromString}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <h2 className="ml-3 mb-3">请求头</h2>
          <div className={`${styles['table-contain']}`}>
            <Table
              bordered
              showHeader={false}
              columns={columns}
              rowKey="key"
              dataSource={config.headers as unknown as Array<DataType>}
              pagination={false}
              className="mb-10"
            />
          </div>
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
                    {config.internal ? <Tag color="green">开启</Tag> : <Tag color="red">关闭</Tag>}
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
                    {config.customFloatScalars}
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
                    {config.customIntScalars}
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
                    {config.skipRenameRootFields}
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
            <div className="flex justify-center items-center w-40">
              <Button
                className={`${styles['connect-check-btn-common']} w-16 ml-4`}
                onClick={() => {
                  handleToggleDesigner('data', content.id, content.source_type)
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
                url: config.url,
                internal: config.isInner,
                customFloatScalars: config.defineFloat,
                customIntScalars: config.defineInt,
                skipRenameRootFields: config.exceptRename,
                headers: config.headers || [{ kind: '0' }],
                agreement: isShowUpSchema,
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
                name="url"
              >
                <Input placeholder="请输入..." />
              </Form.Item>

              <Form.Item name="agreement" valuePropName="checked">
                <Checkbox
                  onChange={() => {
                    setIsShowUpSchema(!isShowUpSchema)
                  }}
                >
                  通过发送指令,自动内省Schema
                </Checkbox>
              </Form.Item>
              {isShowUpSchema ? (
                <Form.Item
                  label={
                    <div>
                      <span className={styles['label-style']}>指定Schema:</span>
                      <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                    </div>
                  }
                  colon={false}
                  name="loadSchemaFromString"
                  required
                  valuePropName="fileList"
                  style={{ marginBottom: '48px' }}
                  getValueFromEvent={normFile}
                >
                  <Upload
                    defaultFileList={
                      (config.loadSchemaFromString as string)
                        ? [
                            {
                              name: config.loadSchemaFromString as unknown as string,
                              uid: config.loadSchemaFromString as unknown as string,
                            },
                          ]
                        : []
                    }
                    onRemove={onRemoveFile}
                    maxCount={1}
                    beforeUpload={(file) => {
                      setFile(file)
                      return false
                    }}
                  >
                    <Button icon={<PlusOutlined />} className="w-148">
                      添加文件
                    </Button>
                  </Upload>
                </Form.Item>
              ) : (
                ''
              )}

              <h2 className="ml-3 mb-3">请求头:</h2>

              <Form.Item wrapperCol={{ span: 16 }}>
                <Form.List name="headers">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space key={field.key} align="baseline">
                          <Form.Item className="w-50" name={[field.name, 'key']}>
                            <Input />
                          </Form.Item>
                          <Form.Item className="w-36" name={[field.name, 'kind']}>
                            <Select>
                              <Option value="0">值</Option>
                              <Option value="1">环境变量</Option>
                              <Option value="2">转发自客户端</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item className="w-126" name={[field.name, 'val']}>
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

                      <Form.Item wrapperCol={{ span: 24 }}>
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
                    name="internal"
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
                    name="customFloatScalars"
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
                    name="customIntScalars"
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
                    name="skipRenameRootFields"
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
