/* eslint-disable camelcase */

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions, Tag } from 'antd'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import type { AuthProvResp } from '@/interfaces/auth'

// import { AuthToggleContext } from '@/lib/context/auth-context'

interface Props {
  content: AuthProvResp
}
type Config = Record<string, any>

export default function AuthMainCheck({ content }: Props) {
  const intl = useIntl()
  // const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const config = content.config as unknown as Config

  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

  const switchState =
    content.switchState?.length == 0
      ? intl.formatMessage({ defaultMessage: '不开启' })
      : content.switchState?.length == 2
      ? intl.formatMessage({ defaultMessage: '基于Token和Cookie' })
      : content.switchState[0] == 'tokenBased'
      ? intl.formatMessage({ defaultMessage: '基于Token' })
      : content.switchState[0] == 'cookieBased'
      ? intl.formatMessage({ defaultMessage: '基于Cookie' })
      : ''

  if (!content) return <Error50x />
  return (
    <>
      <div className="mt-8">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '供应商ID' })}>
            {config.id}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'Issuer' })}>
            {config.issuer}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered column={1} size="small" className="mt-3">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '基于cookie' })}>
            {content.switchState.includes('cookieBased') ? (
              <Tag color="success">开启</Tag>
            ) : (
              <Tag color="default" className="text-[#999]">
                关闭
              </Tag>
            )}
            <span className="text-[#aaa] ml-1">授权码模式</span>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'App ID' })}>
            {config.clientId?.val ?? ''}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'App Secret' })}>
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {config.clientSecret?.val ?? ''}
                  <EyeOutlined className="ml-6" />
                </div>
              ) : config.clientSecret?.val ? (
                <div>
                  ***********
                  <EyeInvisibleOutlined className="ml-6" />
                </div>
              ) : (
                ''
              )}
            </span>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered column={1} size="small" className="mt-3">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '基于token' })}>
            {content.switchState.includes('tokenBased') ? (
              <Tag color="success">开启</Tag>
            ) : (
              <Tag color="default" className="text-[#999]">
                关闭
              </Tag>
            )}
            <span className="text-[#aaa] ml-1">隐式模式</span>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '服务发现地址' })}>
            {`${config.issuer as string}/.well-known/openid-configuration`}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'JWKS' })}>
            {config.jwks == 0 ? 'URL' : 'JSON'}
          </Descriptions.Item>
          {config.jwks === 0 ? (
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'jwksURL' })}>
              {config.jwksURL}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'jwksJSON' })}>
              <pre>{config.jwksJSON}</pre>
            </Descriptions.Item>
          )}
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '用户端点' })}>
            {config.userInfoEndpoint}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
