import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions } from 'antd'
import { useImmer } from 'use-immer'

import type { AuthProvItem } from '@/interfaces/auth'

interface Props {
  content: AuthProvItem
}
export default function AuthenticationMainCheck({ content }: Props) {
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  if (!content) {
    return <></>
  }
  const { info } = content
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
          <Descriptions.Item label="供应商ID">{info.connectName}</Descriptions.Item>
          <Descriptions.Item label="App ID">{info.SQlType}</Descriptions.Item>
          <Descriptions.Item label="App Secret">
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {info.environmentVar}
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
          <Descriptions.Item label="Issuer">{info.environmentVar}</Descriptions.Item>
          <Descriptions.Item label="服务发现地址">{info.connectURL}</Descriptions.Item>
          <Descriptions.Item label="JWKS">{info.host}</Descriptions.Item>
          <Descriptions.Item label="jwksURL">{info.host}</Descriptions.Item>
          <Descriptions.Item label="jwksJSON">{info.host}</Descriptions.Item>
          <Descriptions.Item label="用户端点">{info.port}</Descriptions.Item>
          <Descriptions.Item label="是否开启">{info.userName}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
