/* eslint-disable camelcase */
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions } from 'antd'
import { useImmer } from 'use-immer'

import type { AuthProvResp } from '@/interfaces/auth'

interface Props {
  content: AuthProvResp
}
export default function AuthenticationMainCheck({ content }: Props) {
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  if (!content) {
    return <></>
  }
  const { config } = content
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
          <Descriptions.Item label="App ID">{config.SQlType}</Descriptions.Item>
          <Descriptions.Item label="App Secret">
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {config.environmentVar}
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
          <Descriptions.Item label="Issuer">{config.environmentVar}</Descriptions.Item>
          <Descriptions.Item label="服务发现地址">{config.connectURL}</Descriptions.Item>
          <Descriptions.Item label="JWKS">{config.host}</Descriptions.Item>
          <Descriptions.Item label="jwksURL">{config.host}</Descriptions.Item>
          <Descriptions.Item label="jwksJSON">{config.host}</Descriptions.Item>
          <Descriptions.Item label="用户端点">{config.port}</Descriptions.Item>
          <Descriptions.Item label="是否开启">{content.switch_state}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
