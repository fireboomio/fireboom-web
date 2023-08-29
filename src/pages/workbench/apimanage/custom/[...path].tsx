import { sample } from '@stoplight/json-schema-sampler'
import {
  Breadcrumb,
  Button,
  Form,
  InputNumber,
  message,
  Select,
  Switch,
  Table,
  Tooltip
} from 'antd'
import copy from 'copy-to-clipboard'
// import type { JSONSchema7 } from 'json-schema'
// import jsf from 'json-schema-faker'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import { LinkOutlined } from '@/components/icons'
// import JsonEditor from '@/components/JsonEditor'
import { iconMap } from '@/components/RoleDiagram'
import { OperationType } from '@/interfaces/operation'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import { useRole } from '@/providers/role'
import { useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'
import writeFile from '@/utils/uploadLocal'

type CustomAPIJsonConfig = {
  name: string
  content: string
  operationType: OperationType
  variablesSchema: string
  responseSchema: string
  cacheConfig: null
  authenticationConfig: { authRequired: boolean } | null
  liveQueryConfig: { enabled: boolean; pollingIntervalSeconds: number } | null
  authorizationConfig: {
    claims: string[] | []
    roleConfig: {
      requireMatchAll: string[] | null
      requireMatchAny: string[] | null
      denyMatchAll: string[] | null
      denyMatchAny: string[] | null
    } | null
  } | null
  hooksConfiguration: null
  variablesConfiguration: null
  internal: boolean
  interpolationVariablesSchema: ''
  postResolveTransformations: null
  engine: 0
  path: string
  internalVariablesSchema: string
  injectedVariablesSchema: string
  originContent: string
}

const CustomAPI = () => {
  const intl = useIntl()
  const [ready, setReady] = useState(false)
  const params = useParams()
  const path = params['*']
  const isProxy = path?.startsWith('proxy')
  const { roles } = useRole()
  const { vscode } = useContext(GlobalContext)
  const { globalSetting } = useContext(ConfigContext)
  const { getConfigurationValue } = useConfigurationVariable()
  const { data } = useSWRImmutable<ApiDocuments.Sdk>('/sdk/enabledServer', requests.get)
  const [apiConfig, setApiConfig] = useState<CustomAPIJsonConfig | null>(null)

  const edit = () => {
    vscode.show(`${data?.outputPath}/${path}${data?.extension}`)
  }

  const copyLink = () => {
    let link = `${
      getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl) ?? ''
    }/operations/${path}`
    if (!link) {
      message.error(intl.formatMessage({ defaultMessage: '接口异常' }))
      return
    }
    if (isProxy) {
      copy(link)
    } else {
      const sampleJson: object | null = apiConfig?.variablesSchema
        ? (sample(
            JSON.parse(apiConfig!.variablesSchema.replace(/\$defs/, 'definitions'))
          ) as object)
        : // jsf.generate(JSON.parse(apiConfig!.variablesSchema))
          null
      if (apiConfig?.operationType === OperationType.Mutation) {
        copy(`curl ${link} \\
  -X POST \\
  -H 'Content-Type: application/json' \\
  --data-raw '${JSON.stringify(sampleJson)}' \\
  --compressed`)
      } else {
        const query: string[] = []
        if (sampleJson) {
          query.push(`wg_variables=${JSON.stringify(sampleJson)}`)
        }
        if (apiConfig?.operationType === OperationType.Subscription) {
          query.push('wg_sse=true')
        }
        if (
          apiConfig?.liveQueryConfig?.enabled &&
          apiConfig?.operationType === OperationType.Query
        ) {
          query.push('wg_live=true')
        }
        if (query.length) {
          link += '?' + query.join('&')
        }
        copy(link)
      }
    }
    message.success(intl.formatMessage({ defaultMessage: 'URL 地址已复制' }))
  }

  const saveJson = async (values: CustomAPIJsonConfig) => {
    if (values.variablesSchema) {
      values.variablesSchema = JSON.stringify(values.variablesSchema)
    }
    if (values.responseSchema) {
      values.responseSchema = JSON.stringify(values.responseSchema)
    }
    const newJson = { ...apiConfig, ...values }
    try {
      await writeFile(`${data!.outputPath}/${path}.json`, JSON.stringify(newJson, null, 2))
      setApiConfig(newJson)
      message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    setReady(false)
    if (data?.outputPath) {
      requests
        .get<any, CustomAPIJsonConfig>(`/vscode/readFile?uri=${data.outputPath}/${path}.json`)
        .then(res => {
          // if (res.variablesSchema) {
          //   res.variablesSchema = JSON.parse(res.variablesSchema)
          // }
          // if (res.responseSchema) {
          //   res.responseSchema = JSON.parse(res.responseSchema)
          // }
          setApiConfig(res)
          setReady(true)
        })
    }
  }, [data?.outputPath, path])

  // useEffect(() => {
  //   form.resetFields()
  // }, [path])

  return (
    <div className="h-full flex flex-col" key={path}>
      <div className="flex items-center bg-white mb-3 px-5 py-3">
        <Breadcrumb>
          {path?.split('/').map((item, index) => (
            <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <Tooltip title={intl.formatMessage({ defaultMessage: '复制接口URL地址' })}>
          <LinkOutlined className="cursor-pointer ml-8 text-[#6F6F6F]" onClick={copyLink} />
        </Tooltip>
        <Button className="ml-auto" type="primary" onClick={edit}>
          <FormattedMessage defaultMessage="编辑代码" />
        </Button>
      </div>
      <div className="px-3 flex-1 overflow-y-auto">
        <div className="p-5 bg-white rounded shadow">
          {ready && (
            <Form
              className="common-form"
              // form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              onFinish={saveJson}
              initialValues={apiConfig ?? {}}
            >
              {!isProxy && (
                <Form.Item
                  label={intl.formatMessage({ defaultMessage: '入参定义' })}
                  name="variablesSchema"
                >
                  <ReactJson
                    src={JSON.parse(apiConfig?.variablesSchema ?? '{}')}
                    iconStyle="triangle"
                    collapsed
                    name={false}
                    style={{
                      wordBreak: 'break-word'
                    }}
                  />
                  {/* <JsonEditor schemaUrl="http://json-schema.org/draft-07/schema#" /> */}
                </Form.Item>
              )}
              {!isProxy && (
                <Form.Item
                  label={intl.formatMessage({ defaultMessage: '入参定义' })}
                  name="responseSchema"
                >
                  <ReactJson
                    src={JSON.parse(apiConfig?.responseSchema ?? '{}')}
                    iconStyle="triangle"
                    collapsed
                    name={false}
                    style={{
                      wordBreak: 'break-word'
                    }}
                  />
                  {/* <JsonEditor schemaUrl="http://json-schema.org/draft-07/schema#" /> */}
                </Form.Item>
              )}
              <Form.Item
                label={intl.formatMessage({ defaultMessage: '是否需要认证' })}
                name={['authenticationConfig', 'authRequired']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              {!isProxy && apiConfig?.operationType !== OperationType.Mutation && (
                <Form.Item
                  label={intl.formatMessage({ defaultMessage: '实时查询' })}
                  name={['liveQueryConfig', 'enabled']}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              )}
              {!isProxy && apiConfig?.operationType !== OperationType.Mutation && (
                <Form.Item
                  label={intl.formatMessage({ defaultMessage: '轮询间隔' })}
                  name={['liveQueryConfig', 'pollingIntervalSeconds']}
                >
                  <InputNumber addonAfter="s" />
                </Form.Item>
              )}
              <Form.Item label={intl.formatMessage({ defaultMessage: '角色设置' })}>
                <Table
                  rowKey="name"
                  className="mt-2"
                  pagination={false}
                  columns={[
                    {
                      title: intl.formatMessage({ defaultMessage: '策略' }),
                      dataIndex: 'name',
                      width: '200px',
                      render: (text, record) => (
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-2">{text}</div>
                          {iconMap[text as keyof typeof iconMap]}
                        </div>
                      )
                    },
                    {
                      title: intl.formatMessage({ defaultMessage: '值' }),
                      key: 'value',
                      dataIndex: 'name',
                      render: (text, record) => (
                        <Form.Item name={['authorizationConfig', 'roleConfig', text]}>
                          <Select
                            mode="multiple"
                            className="min-w-full"
                            placeholder={intl.formatMessage({ defaultMessage: '请选择关联的角色' })}
                            options={roles}
                            fieldNames={{
                              label: 'code',
                              value: 'code'
                            }}
                          />
                        </Form.Item>
                      )
                    }
                  ]}
                  dataSource={[
                    {
                      name: 'requireMatchAll'
                    },
                    {
                      name: 'requireMatchAny'
                    },
                    {
                      name: 'denyMatchAll'
                    },
                    {
                      name: 'denyMatchAny'
                    }
                  ]}
                />
              </Form.Item>
              <Form.Item label=" " colon={false}>
                <Button className="btn-cancel">
                  <FormattedMessage defaultMessage="重置" />
                </Button>
                <Button className="btn-save ml-4" htmlType="submit">
                  <FormattedMessage defaultMessage="保存" />
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomAPI
