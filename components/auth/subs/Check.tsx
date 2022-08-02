/* eslint-disable camelcase */

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions, Button } from 'antd'
import { ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context'

import styles from './subs.module.scss'
interface Props {
  content: AuthProvResp
}
interface Config {
  [key: string]: ReactNode
}
export default function AuthMainCheck({ content }: Props) {
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  if (!content) {
    return <></>
  }

  console.log('content', content)
  const config = JSON.parse(content.config) as Config
  console.log('config', config)
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

  return (
    <>
      <div className="pb-3 flex items-center justify-between border-gray border-b">
        <div className="h-7">
          <span className="ml-2 text-sm font-bold">
            {content.name} <span className="text-xs text-gray-500/80">{content.authSupplier}</span>
          </span>
        </div>
        <Button
          className={`${styles['save-btn']}  ml-4`}
          onClick={() => {
            handleBottomToggleDesigner('edit', content.id)
          }}
        >
          <span>编辑</span>
        </Button>
      </div>
      <div className="mt-8">
        <Descriptions
          bordered
          column={1}
          size="small"
          labelStyle={{
            color: '#5F6269',
            backgroundColor: 'white',
            width: '30%',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        >
          <Descriptions.Item label="供应商ID">{config.id}</Descriptions.Item>
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
            {`${config.issuer as string}/.well-known/openid`}
          </Descriptions.Item>
          <Descriptions.Item label="JWKS">{config.jwks == 0 ? 'URL' : 'JSON'}</Descriptions.Item>
          {config.jwks === 0 ? (
            <Descriptions.Item label="jwksURL">
              {`${config.issuer as string}/.well-known/openid-`}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item label="jwksJSON">{config.jwksJSON}</Descriptions.Item>
          )}
          <Descriptions.Item label="用户端点">
            {`${config.issuer as string}/.well-known/openid-`}
          </Descriptions.Item>
          <Descriptions.Item label="是否开启">{switchState}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
