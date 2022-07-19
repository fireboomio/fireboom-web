/* eslint-disable camelcase */

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions, Button } from 'antd'
import { ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context'

import styles from './auth-common-main.module.scss'
interface Props {
  content: AuthProvResp
}
interface Config {
  [key: string]: ReactNode
}
export default function AuthenticationMainCheck({ content }: Props) {
  const { handleToggleDesigner } = useContext(AuthToggleContext)
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  // const [isJWKS, setIsJWKS] = useImmer(Boolean)
  if (!content) {
    return <></>
  }
  console.log('content', content)
  const config = JSON.parse(content.config) as Config
  console.log('config', config)
  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

  return (
    <>
      <div className="pb-3 flex items-center justify-between border-gray border-b">
        <div className="h-7">
          <span className="ml-2 text-sm font-bold">
            系统默认 <span className="text-xs text-gray-500/80">main</span>
          </span>
        </div>
        <Button
          className={`${styles['save-btn']}  ml-4`}
          onClick={() => {
            handleToggleDesigner('edit', content.id)
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
          <Descriptions.Item label="供应商ID">{content.auth_supplier}</Descriptions.Item>
          <Descriptions.Item label="App ID">{config.app_id}</Descriptions.Item>
          <Descriptions.Item label="App Secret">
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {config.app_secret}
                  <EyeOutlined className="ml-6" />
                </div>
              ) : (
                <div>
                  *****************************
                  <EyeInvisibleOutlined className="ml-6" />
                </div>
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Issuer">{config.issuer}</Descriptions.Item>
          <Descriptions.Item label="服务发现地址">{config.service_address}</Descriptions.Item>
          <Descriptions.Item label="JWKS">{config.jwks}</Descriptions.Item>
          <Descriptions.Item label="jwksURL">{config.jwks_url}</Descriptions.Item>
          <Descriptions.Item label="jwksJSON">{config.jwks_json}</Descriptions.Item>
          <Descriptions.Item label="用户端点">{config.user_point}</Descriptions.Item>
          <Descriptions.Item label="是否开启">{content.switch_state}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
