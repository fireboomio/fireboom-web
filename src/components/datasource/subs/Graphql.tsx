import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Switch,
  Descriptions,
  Collapse,
  Form,
  Input,
  Checkbox,
  Space,
  Select,
  Tag,
  Modal,
  Image,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import FormToolTip from '@/components/common/FormTooltip'
import Uploader from '@/components/common/Uploader'
import IconFont from '@/components/iconfont'
import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import {
  DatasourceToggleContext,
  DatasourceDispatchContext,
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'

import GraphiQLApp from '../../../pages/graphiql'
import styles from './Graphql.module.scss'

interface Props {
  content: DatasourceResp
  type: ShowType
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

export default function Graphql({ content, type }: Props) {
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
  const urlReg = /^https?:\/\/[.\w\d:/]+$/i
  // /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
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
        handleToggleDesigner('detail', content.id)
      })
  }

  //表单提交失败回调
  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  // 表单选择后规则校验改变
  const onValueChange = (value: string) => {
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

  const handleChange = (_value: string) => {
    setRulesObj({
      pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/g,
      message: '以字母或下划线开头，只能由字母、下划线和数字组成',
    })
  }

  //文件上传过程钩子
  const normFile = (e: UploadProps) => {
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
  }

  //移除文件回调
  const onRemoveFile = () => {
    setDeleteFlag(true)
    setFile({} as unknown as UploadFile)
  }

  function testGql() {
    setIsModalVisible(true)
  }

  if (!content) {
    return <Error50x />
  }

  return (
    <>
      {type === 'detail' ? (
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
              <div>
                <Button className={'btn-light-bordered w-16 ml-4'} onClick={() => testGql()}>
                  <span>测试</span>
                </Button>
                <Button
                  className={'btn-light-full ml-4'}
                  onClick={() => handleToggleDesigner('form', content.id)}
                >
                  <span>编辑</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Descriptions bordered column={1} size="small" labelStyle={{ width: 190 }}>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>
                      名称
                      <FormToolTip title="名称" />
                    </span>
                  </div>
                }
                className="justify-start"
              >
                {config.apiNameSpace}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>
                      Graphql 端点
                      <FormToolTip title="Graphql 端点" />
                    </span>
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
                      <span className={styles['label-style']}>
                        指定Schema
                        <FormToolTip title="指定Schema" />
                      </span>
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
          <div className={`${styles['table-contain']} mb-8`}>
            <Descriptions
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
            <Panel header="更多设置" key="1" className="site-collapse-custom-panel">
              <div className="flex justify-center mb-8">
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  labelStyle={{
                    width: 190,
                  }}
                >
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          是否内部
                          <FormToolTip title="是否内部" />
                        </span>
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.internal ? <Tag color="green">开启</Tag> : <Tag color="red">关闭</Tag>}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          自定义Float标量
                          <FormToolTip title="自定义Float标量" />
                        </span>
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.customFloatScalars}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          自定义INT标量
                          <FormToolTip title="自定义INT标量" />
                        </span>
                      </div>
                    }
                    className="justify-start"
                  >
                    {config.customIntScalars}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          排除重命名根字段
                          <FormToolTip title="排除重命名根字段" />
                        </span>
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
              labelAlign="right"
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
                    <span className={styles['label-style']}>
                      名称:
                      <FormToolTip title="名称" />
                    </span>
                  </div>
                }
                colon={false}
                style={{ marginBottom: '20px' }}
                name="apiNameSpace"
                rules={[
                  { required: true, message: '名称不能为空' },
                  {
                    pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
                    message: '以字母或下划线开头，只能由数字、字母、下划线组成',
                  },
                ]}
              >
                <Input placeholder="请输入..." />
              </Form.Item>

              <Form.Item
                label={
                  <div>
                    <span className={styles['label-style']}>
                      Graphql 端点:
                      <FormToolTip title="Graphql 端点" />
                    </span>
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

              <Form.Item name="agreement" label=" ">
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
                      <span className={styles['label-style']}>
                        指定Schema:
                        <FormToolTip title="指定Schema" />
                      </span>
                    </div>
                  }
                  colon={false}
                  name="loadSchemaFromString"
                  required
                  valuePropName="fileList"
                  style={{ marginBottom: '48px' }}
                  getValueFromEvent={normFile}
                >
                  <Uploader
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
                  </Uploader>
                </Form.Item>
              ) : (
                ''
              )}

              <h2 className="ml-3 mb-3">请求头:</h2>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Form.List name="headers">
                  {(fields, { add }, { errors }) => (
                    <>
                      {fields.map(field => (
                        <Space key={field.key} align="baseline" style={{ display: 'flex' }}>
                          <Form.Item className="w-52.5" name={[field.name, 'key']}>
                            <Input />
                          </Form.Item>
                          <Form.Item className="w-40" name={[field.name, 'kind']}>
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
                            className="w-135 flex-0"
                            name={[field.name, 'val']}
                            rules={[rulesObj]}
                          >
                            {isValue ? (
                              <Input placeholder="请输入" />
                            ) : (
                              <Select className="w-1/5" style={{ width: '80%' }}>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Image
                            alt="清除"
                            width={14}
                            height={14}
                            preview={false}
                            src="/assets/clear.png"
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
                ghost
                bordered={false}
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className={`${styles['collapse-box']} site-collapse-custom-collapse bg-white-50`}
              >
                <Panel header="更多设置" key="1" className="site-collapse-custom-panel">
                  <Form.Item
                    label={
                      <div>
                        <span className={styles['label-style']}>
                          是否内部
                          <FormToolTip title="是否内部" />
                        </span>
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
                        <span className={styles['label-style']}>
                          自定义Float标量
                          <FormToolTip title="自定义Float标量" />
                        </span>
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
                        <span className={styles['label-style']}>
                          自定义INT标量
                          <FormToolTip title="自定义INT标量" />
                        </span>
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
                        <span className={styles['label-style']}>
                          排除重命名根字段
                          <FormToolTip title="排除重命名根字段" />
                        </span>
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
            <div className="flex justify-center items-center w-40 mt-5">
              <Button
                className={'btn-save ml-4'}
                onClick={() => {
                  form.submit()
                }}
              >
                {content.name == '' ? '创建' : '保存'}
              </Button>
              <Button
                className={'btn-cancel ml-4'}
                onClick={() => handleToggleDesigner('detail', content.id, content.sourceType)}
              >
                <span>取消</span>
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        title="GraphiQL"
        open={isModalVisible}
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
