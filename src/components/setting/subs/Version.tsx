import { Descriptions } from 'antd'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { VersionConfig } from '@/interfaces/setting'
import requests from '@/lib/fetchers'

import styles from './subs.module.less'

export default function SettingMainVersion() {
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
      <div className="pl-8 pt-6 bg-white h-full">
        <Descriptions
          column={1}
          size="small"
          className={styles['descriptions-box']}
          labelStyle={{
            width: '15%'
          }}
        >
          <Descriptions.Item label="版本">
            <div className="flex items-center">
              {verConfig.versionNum ? (
                <div>{verConfig.versionNum}</div>
              ) : (
                <div className="w-50px h-22px"> </div>
              )}
              <div className={styles['check-info']}>查看更新日志</div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="prisma版本">{verConfig.prismaVersion}</Descriptions.Item>
          <Descriptions.Item label="版权">{verConfig.copyright}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
