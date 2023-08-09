/* eslint-disable camelcase */

import { CopyOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions, message, Tag } from 'antd'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { getConfigurationVariableRender } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

import styles from './detail.module.less'
// import { AuthToggleContext } from '@/lib/context/auth-context'

interface Props {
  content: ApiDocuments.Authentication
}

export default function AuthMainCheck({ content }: Props) {
  const intl = useIntl()
  const { globalSetting } = useContext(ConfigContext)
  // const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

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
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'App ID' })}>
            {getConfigurationVariableRender(content.oidcConfig.clientId)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'Issuer' })}>
            {getConfigurationVariableRender(content.issuer)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '服务发现地址' })}>
            {`${getConfigurationVariableRender(
              content.oidcConfig.issuer
            )}/.well-known/openid-configuration`}
          </Descriptions.Item>
          {content.jwksProvider.userInfoEndpoint && (
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: '用户端点' })}>
              {getConfigurationVariableRender(content.jwksProvider.userInfoEndpoint)}
            </Descriptions.Item>
          )}
        </Descriptions>
        <Descriptions bordered column={1} size="small" className="mt-3">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '基于cookie' })}>
            {content.oidcConfigEnabled ? (
              <Tag color="success">开启</Tag>
            ) : (
              <Tag color="default" className="text-[#999]">
                关闭
              </Tag>
            )}
            <span className="text-[#aaa] ml-1">授权码模式</span>
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
              {globalSetting.nodeOptions.publicNodeUrl.staticVariableContent}/auth/cookie/callback/
              {content.name}
              <CopyOutlined
                className="cursor-pointer ml-4"
                onClick={() => {
                  copy(
                    `${globalSetting.nodeOptions.publicNodeUrl.staticVariableContent}/auth/cookie/callback/${config.id}`
                  )
                  message.success(intl.formatMessage({ defaultMessage: '复制成功' }))
                }}
              />
            </div>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered column={1} size="small" className="mt-3">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '基于token' })}>
            {content.jwksProviderEnabled ? (
              <Tag color="success">开启</Tag>
            ) : (
              <Tag color="default" className="text-[#999]">
                关闭
              </Tag>
            )}
            <span className="text-[#aaa] ml-1">隐式模式</span>
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
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'jwksURL' })}>
              {getConfigurationVariableRender(content.jwksProvider?.jwksUrl)}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </>
  )
}
