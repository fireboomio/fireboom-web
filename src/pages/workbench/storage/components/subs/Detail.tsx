import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Descriptions, Divider, Switch } from 'antd'
import { useContext, useMemo } from 'react'
import { useImmer } from 'use-immer'

import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'

import styles from './subs.module.less'

interface Props {
  content?: StorageResp
}

export default function StorageDetail({ content }: Props) {
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  const config = useMemo(() => content?.config, [content?.config])

  return (
    <>
      <div className="pr-110px">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="名称">{content?.name}</Descriptions.Item>
          <Descriptions.Item label="服务地址">http(s)://{config?.endPoint}</Descriptions.Item>
          <Descriptions.Item label="APP ID">{config?.accessKeyID?.val} </Descriptions.Item>
          <Descriptions.Item label="APP Secret">
            <span>
              {isShowSecret ? (
                <div>
                  {config?.secretAccessKey?.val ?? ''}
                  <EyeOutlined
                    className="ml-6 cursor-pointer"
                    onClick={() => setIsShowSecret(!isShowSecret)}
                  />
                </div>
              ) : (
                <div>
                  {(config?.secretAccessKey?.val ?? '').replaceAll(/./g, '*')}
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
