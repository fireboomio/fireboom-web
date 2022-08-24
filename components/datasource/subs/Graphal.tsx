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
  Modal,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext, DatasourceDispatchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import GraphiQLApp from '../../../pages/graphiql'
import styles from './Graphal.module.scss'

interface Props {
  content: DatasourceResp
  type: string
}
interface Config {
  [key: string]: string | undefined | number
}
interface DataType {
  key: string
  kind: string
  val: string
}
interface FromValues {
  [key: string]: string | undefined | number | Array<DataType>
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
  const config = content.config as Config
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [file, setFile] = useImmer<UploadFile>({} as UploadFile)
  const [rulesObj, setRulesObj] = useImmer({})
  const [deleteFlag, setDeleteFlag] = useImmer(false)
  const [isShowUpSchema, setIsShowUpSchema] = useImmer(config.loadSchemaFromString !== undefined)
  const [isModalVisible, setIsModalVisible] = useImmer(false)
  const [isValue, setIsValue] = useImmer(true)

  const [form] = Form.useForm()
  const { Option } = Select
  const { Panel } = Collapse
  const urlReg =
    /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
  useEffect(() => {
    setIsShowUpSchema(config.loadSchemaFromString !== undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, type])

  //表单提交成功回调
  const onFinish = async (values: FromValues) => {
    console.log('SuccessValues:', values)
    values.headers = (values.headers as Array<DataType>)?.filter(item => item.key != undefined)
    const newValues = { ...values }
    const index = (config.loadSchemaFromString as string)?.lastIndexOf('/')
    const fileId = (config.loadSchemaFromString as string)?.substring(index + 1) //文件id
    //如果进行上传文件操作
    if (file.uid) {
      //如果存在已经上传文件 先删除先前文件
      if (config.loadSchemaFromString) {
        await requests({
          method: 'post',
          url: '/dataSource/removeFile',
          data: { id: fileId },
        })
      }
      newValues.loadSchemaFromString = (await requests({
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
        newValues.loadSchemaFromString = undefined
      } else newValues.loadSchemaFromString = config.loadSchemaFromString //如果没有进行上传文件操作，且没有删除文件，将原本的文件路径保存
    }
    //创建新的item情况post请求,并将前端用于页面切换的id删除;编辑Put请求
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
        handleToggleDesigner('data', content.id)
      })
  }

  //表单提交失败回调
  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
    console.log('123')
  }
  // 表单选择后规则校验改变
  const onGenderChange = (value: string) => {
    switch (value) {
      case '0':
        setIsValue(true)
        setRulesObj({ pattern: /^\w{1,128}$/g, message: '请输入长度不大于128的非空值' })
        return
      case '1':
        setIsValue(false)
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

  const children: React.ReactNode[] = []

  const handleChange = (value: string) => {
    setRulesObj({
      pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/g,
      message: '以字母或下划线开头，只能由字母、下划线和数字组成',
    })
    console.log(`selected ${value}`)
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
        switch: isChecked == true ? 0 : 1,
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
          dispatch({ type: 'fetched', data: res })
        })
      })
    console.log('switch change')
  }

  //移除文件回调
  const onRemoveFile = () => {
    console.log('删除文件')
    setDeleteFlag(true)
    setFile({} as unknown as UploadFile)
  }

  function testGql() {
    setIsModalVisible(true)
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
                checked={content.switch == 0 ? true : false}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={connectSwitchOnChange}
                className={styles['switch-check-btn']}
              />
              <div className="w-160px">
                <Button
                  className={`${styles['connect-check-btn-common']} w-16 ml-4`}
                  onClick={() => testGql()}
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
                    <span className={styles['label-style']}>Graphql 端点</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.url}
              </Descriptions.Item>

              {config?.loadSchemaFromString ? (
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
              ) : (
                ''
              )}
            </Descriptions>
          </div>
          <h2 className="ml-3 mb-3">请求头</h2>
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
              onFinish={values => void onFinish(values as Config)}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              validateTrigger={['onBlur', 'onChange']}
              className="ml-3"
              labelAlign="left"
              initialValues={{
                apiNameSpace: config.apiNameSpace,
                url: config.url,
                internal: config.isInner,
                customFloatScalars: config.defineFloat,
                customIntScalars: config.defineInt,
                skipRenameRootFields: config.exceptRename,
                headers: config.headers || [{ kind: '0' }],
                agreement: config.loadSchemaFromString !== undefined ? true : false,
              }}
            >
              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>命名空间:</span>
                    <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                colon={false}
                style={{ marginBottom: '20px' }}
                name="apiNameSpace"
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
                rules={[
                  {
                    pattern: urlReg,
                    message: '请填写规范域名',
                  },
                ]}
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
                  >
                    <Button icon={<PlusOutlined />} className="w-159.5">
                      添加文件
                    </Button>
                  </Upload>
                </Form.Item>
              ) : (
                ''
              )}

              <h2 className="ml-3 mb-3">请求头:</h2>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Form.List name="headers">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space key={field.key} align="baseline">
                          <Form.Item className="w-52.5" name={[field.name, 'key']}>
                            <Input />
                          </Form.Item>
                          <Form.Item className="w-40" name={[field.name, 'kind']}>
                            <Select onChange={onGenderChange}>
                              <Option value="0">值</Option>
                              <Option value="1">环境变量</Option>
                              <Option value="2">转发自客户端</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            className="w-135"
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
                    rules={[rulesObj]}
                    colon={false}
                    style={{ marginBottom: '20px' }}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Tags Mode"
                      onChange={handleChange}
                    >
                      {children}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>自定义INT标量:</span>
                        <IconFont type="icon-wenhao" className={`${styles['form-icon']} ml-1`} />
                      </div>
                    }
                    name="customIntScalars"
                    rules={[rulesObj]}
                    colon={false}
                    style={{ marginBottom: '20px' }}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Tags Mode"
                      onChange={handleChange}
                    >
                      {children}
                    </Select>
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
                    rules={[rulesObj]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Tags Mode"
                      onChange={handleChange}
                    >
                      {children}
                    </Select>
                  </Form.Item>
                </Panel>
              </Collapse>
            </Form>
          </div>
        </>
      )}

      <Modal
        title="GraphiQL"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{ height: '90vh' }}
        width={'90vw'}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <GraphiQLApp url={config.url as string} data={''} onSave={() => {}} />
      </Modal>
    </>
  )
}
