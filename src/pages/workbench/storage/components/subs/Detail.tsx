import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Descriptions } from 'antd'
import { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import type { StorageResp } from '@/interfaces/storage'

import styles from './subs.module.less'

interface Props {
  content?: StorageResp
}

export default function StorageDetail({ content }: Props) {
  const intl = useIntl()
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  const config = useMemo(() => content?.config, [content?.config])

  return (
    <>
      <div className="pr-110px">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '名称' })}>
            {content?.name}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '服务地址' })}>
            http(s)://{config?.endPoint}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'APP ID' })}>
            {config?.accessKeyID?.val}{' '}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'APP Secret' })}>
            <span>
              {isShowSecret ? (
                <div>
                  {config?.secretAccessKey?.val ?? ''}
                  <EyeOutlined
                    className="cursor-pointer ml-6"
                    onClick={() => setIsShowSecret(!isShowSecret)}
                  />
                </div>
              ) : (
                <div>
                  {(config?.secretAccessKey?.val ?? '').replaceAll(/./g, '*')}
                  <EyeInvisibleOutlined
                    className="cursor-pointer ml-6"
                    onClick={() => setIsShowSecret(!isShowSecret)}
                  />
                </div>
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '区域' })}>
            {config?.bucketLocation}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '桶名称' })}>
            {config?.bucketName}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '开启SSL' })}>
            {config?.useSSL ? (
              <Button className={styles['ssl-open-btn']}>
                <FormattedMessage defaultMessage="开启" />
              </Button>
            ) : (
              <Button className={styles['ssl-close-btn']}>
                <FormattedMessage defaultMessage="关闭" />
              </Button>
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
