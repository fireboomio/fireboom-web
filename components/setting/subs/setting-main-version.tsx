import { Descriptions, Divider } from 'antd'
import { useEffect } from 'react'

import requests from '@/lib/fetchers'

import styles from './setting-main.module.scss'

let versionConfig: { [key: string]: number | string | boolean | object }

export default function SettingMainVersion() {
  useEffect(() => {
    async function getData() {
      const result = await requests.get('/setting/versionConfig')
      console.log(versionConfig, '123')
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
             <span>{versionConfig.versionNum}</span> 
              <span className={styles['check-info']}>查看更新日志</span>
            </Descriptions.Item>
            <Descriptions.Item label="prisma版本">{versionConfig.prismaVersion}</Descriptions.Item>
            <Descriptions.Item label="版权">{versionConfig.copyright}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  )
}
