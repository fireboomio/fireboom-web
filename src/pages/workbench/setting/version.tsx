import { Descriptions } from 'antd'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import type { VersionConfig } from '@/interfaces/setting'
import requests from '@/lib/fetchers'

import styles from './components/subs/subs.module.less'

export default function SettingMainVersion() {
  const intl = useIntl()
  const [verConfig, setVerConfig] = useImmer({} as VersionConfig)

  useEffect(() => {
    async function getData() {
      const result = await requests.get<unknown, VersionConfig>('/setting/versionConfig')
      setVerConfig(result)
    }
    void getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="bg-white h-full pt-6 pl-8">
        <Descriptions
          column={1}
          size="small"
          className={styles['descriptions-box']}
          labelStyle={{
            width: '15%'
          }}
        >
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '版本' })}>
            <div className="flex items-center">
              {verConfig.versionNum ? (
                <div>{verConfig.versionNum}</div>
              ) : (
                <div className="h-22px w-50px"> </div>
              )}
              <div className={styles['check-info']}>
                <FormattedMessage defaultMessage="查看更新日志" />
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'prisma版本' })}>
            {verConfig.prismaVersion}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'prisma引擎版本' })}>
            {verConfig.prismaEngineVersion}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '版权' })}>
            {verConfig.copyright}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
