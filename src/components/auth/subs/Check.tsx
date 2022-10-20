/* eslint-disable camelcase */

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions } from 'antd'
import type { ReactNode } from 'react'
import { useContext, useMemo } from 'react'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import type { AuthProvResp } from '@/interfaces/auth'
import { HOST } from '@/lib/common'
import { AuthToggleContext } from '@/lib/context/auth-context'

interface Props {
  content: AuthProvResp
}
type Config = Record<string, ReactNode>

export default function AuthMainCheck({ content }: Props) {
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  console.log('===', content)
  const config = content.config as unknown as Config

  const sid = useMemo(() => {
    return `${HOST}/app/main/auth/cookie/authorize/${config.id}?redirect_uri=${encodeURIComponent(
      'http://8.142.115.204:9123'
    )}/`
  }, [config.id])

  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

  const switchState =
    content.switchState?.length == 0
      ? '不开启'
      : content.switchState?.length == 2
      ? '基于Token和Cookie'
      : content.switchState[0] == 'tokenBased'
      ? '基于Token'
      : content.switchState[0] == 'cookieBased'
      ? '基于Cookie'
      : ''

  if (!content) return <Error50x />

  return (
    <>
      <div className="mt-8">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="供应商ID">
            <a href={sid}>{config.id}</a>
          </Descriptions.Item>
          <Descriptions.Item label="App ID">{config.clientId}</Descriptions.Item>
          <Descriptions.Item label="App Secret">
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {config.clientSecret}
                  <EyeOutlined className="ml-6" />
                </div>
              ) : config.clientSecret ? (
                <div>
                  ***********
                  <EyeInvisibleOutlined className="ml-6" />
                </div>
              ) : (
                ''
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Issuer">{config.issuer}</Descriptions.Item>
          <Descriptions.Item label="服务发现地址">
            {`${config.issuer as string}/.well-known/openid-configuration`}
          </Descriptions.Item>
          <Descriptions.Item label="JWKS">{config.jwks == 0 ? 'URL' : 'JSON'}</Descriptions.Item>
          {config.jwks === 0 ? (
            <Descriptions.Item label="jwksURL">
              {`${config.issuer as string}/.well-known/jwks.json`}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item label="jwksJSON">
              <pre>{config.jwksJSON}</pre>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="用户端点">{`${config.issuer as string}/me`}</Descriptions.Item>
          <Descriptions.Item label="是否开启">{switchState}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
