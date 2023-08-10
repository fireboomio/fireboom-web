import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Descriptions } from 'antd'
import { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import { getConfigurationVariableRender } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

import styles from './subs.module.less'

interface Props {
  content?: ApiDocuments.Storage
}

export default function StorageDetail({ content }: Props) {
  const intl = useIntl()
  const [isShowSecret, setIsShowSecret] = useImmer(false)

  return (
    <>
      <div className="pr-110px">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '名称' })}>
            {content?.name}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '服务地址' })}>
            {getConfigurationVariableRender(content?.endpoint)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'APP ID' })}>
            {getConfigurationVariableRender(content?.accessKeyID)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'APP Secret' })}>
            {getConfigurationVariableRender(content?.secretAccessKey, {
              enableVisible: true,
              visible: isShowSecret,
              onVisibleChange: v => {
                setIsShowSecret(v)
              }
            })}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '区域' })}>
            {getConfigurationVariableRender(content?.bucketLocation)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '桶名称' })}>
            {getConfigurationVariableRender(content?.bucketName)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '开启SSL' })}>
            {content?.useSSL ? (
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
