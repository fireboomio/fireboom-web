import { Descriptions, Divider } from 'antd'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './setting-main.module.scss'

interface VersionConfig {
  versionNum: string
  prismaVersion: string
  copyright: string
}

export default function SettingMainVersion() {
  const [verConfig, setVerConfig] = useImmer({} as VersionConfig)
  useEffect(() => {
    async function getData() {
      const result = await requests.get<unknown, VersionConfig>('/setting/versionConfig')
      console.log(result)
      setVerConfig(result)
    }
    void getData()
  }, [])

  return (
    <>
      <div>
        <Divider type="horizontal" />
        <div className="flex justify-center mb-8 ml-5">
          <Descriptions
            column={1}
            size="small"
            className={styles['descriptions-box']}
            labelStyle={{
              backgroundColor: 'white',
              width: '15%',
              borderRight: 'none',
              borderBottom: 'none',
            }}
          >
            <Descriptions.Item label="版本">
              {verConfig.versionNum}
              <span className={styles['check-info']}>查看更新日志</span>
            </Descriptions.Item>
            <Descriptions.Item label="prisma版本">{verConfig.prismaVersion}</Descriptions.Item>
            <Descriptions.Item label="版权">{verConfig.copyright}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  )
}
