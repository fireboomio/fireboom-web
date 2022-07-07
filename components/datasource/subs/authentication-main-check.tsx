import {
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Descriptions, Button, Switch } from 'antd'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './authentication-main.module.scss'
interface Props {
  content: DatasourceItem
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
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  return (
    <>
      <div className="pb-17px flex items-center justify-between border-gray border-b ">
        <div>
          <span className="ml-2">
            {content.name} <span className="text-xs text-gray-500/80">main</span>
          </span>
        </div>
      </div>
      <div className="flex justify-between">
        <div className={styles.authHead}>
          <InfoCircleOutlined />
          <span>根据各种提供器选择逻辑，获取当前用户的角色</span>
        </div>
        <div className={`${styles.authBtn} flex mr-2`}>
          <Button type="text" icon={<PlayCircleOutlined />}>
            测试
          </Button>
          <Button type="text" icon={<PlusCircleOutlined />}>
            添加
          </Button>
          <Button type="text" icon={<UnorderedListOutlined />}>
            管理
          </Button>
          <Button type="text" icon={<PlayCircleOutlined />}>
            选择
          </Button>
          <Switch
            defaultChecked
            className={styles['switch-edit-btn']}
            size="small"
            onChange={connectSwitchOnChange}
          />
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
