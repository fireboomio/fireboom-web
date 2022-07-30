import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions, Divider } from 'antd'
import { useContext, useMemo } from 'react'
import { useImmer } from 'use-immer'

import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context'

import styles from './storage-main.module.scss'

interface Props {
  content?: StorageResp
}

export default function StorageDetail({ content }: Props) {
  const { handleSwitch } = useContext(StorageSwitchContext)
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  const config = useMemo(() => content?.config, [content?.config])

  const handleToggleBucket = () => {
    console.log('switch change')
  }

  return (
    <>
      <div className="pb-2 flex items-center justify-between border-gray border-b">
        <div>
          <span className="text-base leading-5 font-bold">设置</span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked={content?.switch == 0 ? false : true}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={handleToggleBucket}
            className={styles['switch-check-btn']}
          />
          <Divider type="vertical" />
          <Button
            className={`${styles['save-btn']}  ml-4`}
            onClick={() => handleSwitch('form', content?.id)}
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
          <Descriptions.Item label="名称">{content?.name}</Descriptions.Item>
          <Descriptions.Item label="服务地址">{config?.endpoint}</Descriptions.Item>
          <Descriptions.Item label="APP ID">{config?.accessKeyID} </Descriptions.Item>
          <Descriptions.Item label="APP Secret">
            <span>
              {isShowSecret ? (
                <div>
                  {config?.secretAccessKey}
                  <EyeOutlined
                    className="ml-6 cursor-pointer"
                    onClick={() => setIsShowSecret(!isShowSecret)}
                  />
                </div>
              ) : (
                <div>
                  {config?.secretAccessKey.replaceAll(/./g, '*')}
                  <EyeInvisibleOutlined
                    className="ml-6 cursor-pointer"
                    onClick={() => setIsShowSecret(!isShowSecret)}
                  />
                </div>
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="区域">{config?.bucketLocation}</Descriptions.Item>
          <Descriptions.Item label="bucketName">{config?.bucketName}</Descriptions.Item>
          <Descriptions.Item label="开启SSL">
            {config?.useSSL ? (
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
