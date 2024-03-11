/* eslint-disable camelcase */

import { CopyOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions, Tag, message } from 'antd'
import clsx from 'clsx'
import _copy from 'copy-to-clipboard'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { getConfigurationVariableRender, useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

import { proxy } from '@/lib/fetchers'
import styles from './detail.module.less'
// import { AuthToggleContext } from '@/lib/context/auth-context'

interface Props {
  content: ApiDocuments.Authentication
}

export default function AuthMainCheck({ content }: Props) {
  const intl = useIntl()
  const { globalSetting } = useContext(ConfigContext)
  const { getConfigurationValue } = useConfigurationVariable()
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [openConfig, setOpenConfig] = useState<{ userinfo_endpoint: string; jwks_uri: string }>({})

  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

  const copy = (text: string) => {
    _copy(text)
    message.success(intl.formatMessage({ defaultMessage: '复制成功' }))
  }

  useEffect(() => {
    if (content.issuer) {
      const url = getConfigurationValue(content.issuer)
      if (url) {
        proxy(`${url}/.well-known/openid-configuration`).then(res => {
          setOpenConfig(res)
        })

      }
    }
  }, [content.issuer, getConfigurationValue])

  // const switchState =
  //   content.switchState?.length == 0
  //     ? intl.formatMessage({ defaultMessage: '不开启' })
  //     : content.switchState?.length == 2
  //     ? intl.formatMessage({ defaultMessage: '基于Token和Cookie' })
  //     : content.switchState[0] == 'tokenBased'
  //     ? intl.formatMessage({ defaultMessage: '基于Token' })
  //     : content.switchState[0] == 'cookieBased'
  //     ? intl.formatMessage({ defaultMessage: '基于Cookie' })
  //     : ''

  if (!content) return <Error50x />
  return (
    <>
      <div className={clsx('mt-8', styles.descriptions)}>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '供应商ID' })}>
            {content.name}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'Issuer' })}>
            {getConfigurationVariableRender(content.issuer)}
            <CopyOutlined
              className="cursor-pointer ml-4"
              onClick={() => {
                copy(
                  `${getConfigurationValue(content.issuer)}`
                )
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '服务发现地址' })}>
            {`${getConfigurationVariableRender(content.issuer)}/.well-known/openid-configuration`}
            <CopyOutlined
              className="cursor-pointer ml-4"
              onClick={() => {
                copy(
                  `${getConfigurationValue(content.issuer)}/.well-known/openid-configuration`
                )
              }}
            />
          </Descriptions.Item>
          {openConfig.userinfo_endpoint && (
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: '用户端点(自动解析)' })}>
              {openConfig.userinfo_endpoint}
              <CopyOutlined
              className="cursor-pointer ml-4"
              onClick={() => {
                copy(openConfig.userinfo_endpoint)
              }}
            />
            </Descriptions.Item>
          )}
        </Descriptions>
        <Descriptions bordered column={1} size="small" className="mt-3">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '基于cookie' })}>
            {content.oidcConfigEnabled ? (
              <Tag color="success">
                <FormattedMessage defaultMessage="开启" />
              </Tag>
            ) : (
              <Tag color="default" className="text-[#999]">
                <FormattedMessage defaultMessage="关闭" />
              </Tag>
            )}
            <span className="text-[#aaa] ml-1">
              <FormattedMessage defaultMessage="授权码模式" />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'App ID' })}>
            {getConfigurationVariableRender(content.oidcConfig?.clientId)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'App Secret' })}>
            <span className="flex items-center">
              {isShowSecret ? (
                <>
                  <span>{getConfigurationVariableRender(content.oidcConfig?.clientSecret)}</span>
                  <EyeOutlined className="ml-4" onClick={handleToggleSecret} />
                </>
              ) : (
                <>
                  <span>***********</span>
                  <EyeInvisibleOutlined className="ml-4" onClick={handleToggleSecret} />
                </>
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '登录回调地址' })}>
            <div className="flex items-center">
              {getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl)}/auth/cookie/callback/
              {content.name}
              <CopyOutlined
                className="cursor-pointer ml-4"
                onClick={() => {
                  copy(
                    `${getConfigurationValue(
                      globalSetting.nodeOptions.publicNodeUrl
                    )}/auth/cookie/callback/${content.name}`
                  )
                }}
              />
            </div>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered column={1} size="small" className="mt-3">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '基于token' })}>
            {content.jwksProviderEnabled ? (
              <Tag color="success">
                <FormattedMessage defaultMessage="开启" />
              </Tag>
            ) : (
              <Tag color="default" className="text-[#999]">
                <FormattedMessage defaultMessage="关闭" />
              </Tag>
            )}
            <span className="text-[#aaa] ml-1">
              <FormattedMessage defaultMessage="隐式模式" />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'JWKS' })}>
            {content.jwksProvider?.jwksJson ? 'JSON' : 'URL'}
          </Descriptions.Item>
          {content.jwksProvider?.jwksJson ? (
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'jwksJSON' })}>
              <pre className="overflow-x-auto">
                {getConfigurationVariableRender(content.jwksProvider?.jwksJson)}
              </pre>
            </Descriptions.Item>
          ) : (
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'jwksURL(自动解析)' })}>
              {openConfig.jwks_uri}
              <CopyOutlined
              className="cursor-pointer ml-4"
              onClick={() => {
                copy(openConfig.jwks_uri)
              }}
            />
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </>
  )
}
