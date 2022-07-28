import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions, Divider } from 'antd'
import { ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'

import type { FileStorageResp } from '@/interfaces/storage'
import { FSToggleContext } from '@/lib/context'

import styles from './storage-main.module.scss'

interface Props {
  content?: FileStorageResp
}
interface Config {
  [key: string]: ReactNode
}
export default function StorageViewer({ content }: Props) {
  const { handleToggleDesigner } = useContext(FSToggleContext)
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const config = JSON.parse(content.config) as Config
  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }
  console.log(config)
  return (
    <>
      <div className="pb-2 flex items-center justify-between border-gray border-b">
        <div>
          <span className="text-base leading-5 font-bold">设置</span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked={content.switch == 0 ? false : true}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className={styles['switch-check-btn']}
          />
          <Divider type="vertical" />
          <Button
            className={`${styles['save-btn']}  ml-4`}
            onClick={() => {
              handleToggleDesigner('setEdit', content.id)
            }}
          >
            <span>编辑</span>
          </Button>
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
          <Descriptions.Item label="名称">{content.name}</Descriptions.Item>
          <Descriptions.Item label="服务地址">{config.service_address}</Descriptions.Item>
          <Descriptions.Item label="APP ID">{config.accessKeyID} </Descriptions.Item>
          <Descriptions.Item label="APP Secret">
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {config.secretAccessKey}
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
          <Descriptions.Item label="区域">{config.bucketLocation}</Descriptions.Item>
          <Descriptions.Item label="bucketName">{config.bucketName}</Descriptions.Item>
          <Descriptions.Item label="开启SSL">
            {config.useSSL ? (
              <Button className={styles['ssl-open-btn']}>开启</Button>
            ) : (
              <Button className={styles['ssl-close-btn']}>关闭</Button>
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
