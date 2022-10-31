import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Collapse,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Tag
} from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { Rule } from 'antd/lib/form'
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
// import GraphiQLApp from '../../../pages/graphiql'
import styles from './Graphql.module.less'

interface Props {
  content: DatasourceResp
  type: ShowType
}
type Config = Record<string, string | undefined | number>

interface DataType {
  key: string
  kind: string
  val: string
}

interface OptionT {
  label: string
  value: string
}

type FromValues = Record<string, string | undefined | number | Array<DataType>>

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

const BASEPATH = '/static/upload/oas'

export default function Graphql({ content, type }: Props) {
  const navigate = useNavigate()
  const config = content.config as Config
  const { handleSave, handleToggleDesigner } = useContext(DatasourceToggleContext)
  const [file, setFile] = useImmer<UploadFile>({} as UploadFile)
  const [rulesObj, setRulesObj] = useImmer<Rule>({})
  const [deleteFlag, setDeleteFlag] = useImmer(false)
  const [isShowUpSchema, setIsShowUpSchema] = useImmer(config.loadSchemaFromString !== undefined)
  const [isModalVisible, setIsModalVisible] = useImmer(false)
  const [isValue, setIsValue] = useImmer(true)

  const [envOpts, setEnvOpts] = useImmer<OptionT[]>([])
  const [envVal, setEnvVal] = useImmer('')
  const [visible, setVisible] = useImmer(false)

  const [form] = Form.useForm()
  const { Option } = Select
  const { Panel } = Collapse
  const urlReg = /^https?:\/\/[-.\w\d:/]+$/i
  // /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
  useEffect(() => {
    setIsShowUpSchema(config.loadSchemaFromString !== undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

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

  //表单提交成功回调
  const onFinish = async (values: FromValues) => {
    values.headers = (values.headers as Array<DataType>)?.filter(item => item.key != undefined)
    const newValues = { ...values }
    //创建新的item情况post请求,并将前端用于页面切换的id删除;编辑Put请求
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
        setRulesObj({ pattern: /^\w+$/g, message: '请输入非空值' })
        return
      default:
        return
    }
  }

  const children: React.ReactNode[] = []

  const handleChange = (_value: string | string[]) => {
    setRulesObj({
      type: 'array',
      validator(_, value) {
        return value.every((v: string) => v.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/g))
          ? Promise.resolve()
          : Promise.reject('以字母或下划线开头，只能由字母、下划线和数字组成')
      }
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
        switch: isChecked == true ? 0 : 1
      })
      .then(() => {
        handleSave({
          ...content,
          switch: isChecked == true ? 0 : 1
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

  const setUploadPath = (v: string) => {
    form.setFieldValue('loadSchemaFromString', v)
  }

  if (!content) {
    return <Error50x />
  }

  return (
    <>
      {type === 'detail' ? (
        //查看页面--------------------------------------------------------------------------
        <>
          {/* <div className="pb-9px flex items-center justify-between border-gray border-b mb-8">
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
          </div> */}

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
          <div className="text-base font-medium ml-3 mb-3">请求头</div>
          <div className={`${styles['table-contain']} mb-8`}>
            <Descriptions bordered column={1} size="small" labelStyle={{ width: 190 }}>
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
                <Descriptions bordered column={1} size="small" labelStyle={{ width: 190 }}>
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
        <>
          <div className="pb-9px flex items-center justify-between border-gray border-b">
            {content.name == '' ? (
              <div>
                <IconFont type="icon-QLweixuanzhong1" />
                <span className="ml-2">创建数据源</span>
              </div>
            ) : (
              <div>
                <IconFont type="icon-QLweixuanzhong1" />
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
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
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
                headers: config.headers || [],
                agreement: config.loadSchemaFromString !== undefined ? true : false
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
                    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/g,
                    message: '以字母或下划线开头，只能由数字、字母、下划线组成'
                  }
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
                  { required: true, message: '端点不能为空' },
                  { pattern: urlReg, message: '请填写规范域名' }
                ]}
                style={{ marginBottom: '20px' }}
                name="url"
              >
                <Input placeholder="请输入..." />
              </Form.Item>

              <Form.Item name="agreement" label=" " valuePropName="checked">
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
                  // valuePropName="fileList"
                  style={{ marginBottom: '48px' }}
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
                  {/* <Uploader
                    defaultFileList={
                      (config.loadSchemaFromString as string)
                        ? [
                            {
                              name: config.loadSchemaFromString as unknown as string,
                              uid: config.loadSchemaFromString as unknown as string
                            }
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
                  </Uploader> */}
                </Form.Item>
              ) : (
                ''
              )}

              <h2 className="ml-3 mb-3">请求头:</h2>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Form.List name="headers">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, idx) => (
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
                            rules={
                              form.getFieldValue(['headers', field.name, 'kind']) === '0'
                                ? [
                                    {
                                      pattern: /^\w{1,128}$/g,
                                      message: '请输入长度不大于128的非空值'
                                    }
                                  ]
                                : []
                            }
                          >
                            {form.getFieldValue(['headers', field.name, 'kind']) === '0' ? (
                              <Input placeholder="请输入" />
                            ) : (
                              <Select
                                className="w-1/5"
                                style={{ width: '80%' }}
                                options={envOpts}
                                value={envVal}
                                onChange={value => setEnvVal(value)}
                              />
                            )}
                          </Form.Item>
                          <Image
                            alt="清除"
                            width={14}
                            height={14}
                            preview={false}
                            src="/assets/clear.png"
                            className="cursor-pointer"
                            onClick={() => remove(idx)}
                          />
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
          </div>
        </>
      )}

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
        {/* <GraphiQLApp url={config.url as string} data={''} onSave={() => {}} /> */}
      </Modal>
    </>
  )
}
