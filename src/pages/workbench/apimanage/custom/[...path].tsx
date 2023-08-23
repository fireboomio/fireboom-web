import { Breadcrumb, Button, Descriptions, message, Switch, Table, Tooltip } from 'antd'
import copy from 'copy-to-clipboard'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import { LinkOutlined } from '@/components/icons'
import type { OperationType } from '@/interfaces/operation'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import { useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

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
  const params = useParams()
  const path = params['*']
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
    copy(link)
    message.success(intl.formatMessage({ defaultMessage: 'URL 地址已复制' }))
  }

  useEffect(() => {
    if (data?.outputPath) {
      requests
        .get<any, CustomAPIJsonConfig>(`/vscode/readFile?uri=${data.outputPath}/${path}.json`)
        .then(res => {
          setApiConfig(res)
        })
    }
  }, [data?.outputPath, path])

  return (
    <div className="h-full flex flex-col">
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
          {apiConfig && (
            <Descriptions bordered column={1} size="small" labelStyle={{ width: '200px' }}>
              {apiConfig.variablesSchema && (
                <Descriptions.Item label={intl.formatMessage({ defaultMessage: '入参定义' })}>
                  <ReactJson
                    src={JSON.parse(apiConfig.variablesSchema)}
                    iconStyle="triangle"
                    collapsed
                    name={false}
                    style={{
                      wordBreak: 'break-word'
                    }}
                  />
                </Descriptions.Item>
              )}
              {apiConfig.responseSchema && (
                <Descriptions.Item label={intl.formatMessage({ defaultMessage: '响应定义' })}>
                  <ReactJson
                    src={JSON.parse(apiConfig.responseSchema)}
                    iconStyle="triangle"
                    collapsed
                    name={false}
                    style={{
                      wordBreak: 'break-word'
                    }}
                  />
                </Descriptions.Item>
              )}

              <Descriptions.Item label={intl.formatMessage({ defaultMessage: '是否需要认证' })}>
                <Switch
                  checked={apiConfig.authenticationConfig?.authRequired ?? false}
                  onChange={() => {}}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({ defaultMessage: '实时查询' })}
                contentStyle={{ alignItems: 'center' }}
              >
                <Switch checked={apiConfig.liveQueryConfig?.enabled ?? false} onChange={() => {}} />
                {apiConfig.liveQueryConfig?.enabled && (
                  <span className="ml-3">
                    <FormattedMessage defaultMessage="轮询间隔" />
                    <span className="ml-1">
                      {apiConfig.liveQueryConfig.pollingIntervalSeconds}s
                    </span>
                  </span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ defaultMessage: '权限设置' })}>
                <div>
                  <FormattedMessage defaultMessage="角色设置" />
                  <Table
                    className="mt-2"
                    pagination={false}
                    columns={[
                      {
                        title: intl.formatMessage({ defaultMessage: '策略' }),
                        dataIndex: 'name',
                        width: '200px'
                      },
                      {
                        title: intl.formatMessage({ defaultMessage: '值' }),
                        dataIndex: 'value'
                      }
                    ]}
                    dataSource={[
                      {
                        name: 'requireMatchAll',
                        value: apiConfig.authorizationConfig?.roleConfig?.requireMatchAll ?? []
                      },
                      {
                        name: 'requireMatchAny',
                        value: apiConfig.authorizationConfig?.roleConfig?.requireMatchAny ?? []
                      },
                      {
                        name: 'denyMatchAll',
                        value: apiConfig.authorizationConfig?.roleConfig?.denyMatchAll ?? []
                      },
                      {
                        name: 'denyMatchAny',
                        value: apiConfig.authorizationConfig?.roleConfig?.denyMatchAny ?? []
                      }
                    ]}
                  />
                </div>
                {/* <div className="mt-3">
                  <FormattedMessage defaultMessage="自定义 Claim" />
                  <span className="ml-3"></span>
                </div> */}
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomAPI
