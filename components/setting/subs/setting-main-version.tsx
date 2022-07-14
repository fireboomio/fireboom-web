import { Descriptions, Divider } from 'antd'
import axios from 'axios'
import { useEffect } from 'react'

import styles from './setting-main.module.scss'

let versionConfig: { [key: string]: number | string | boolean | object }
interface Response {
  status: number
  data: {
    result: { [key: string]: number | string | boolean | object }
    [key: string]: number | string | boolean | object
  }
  [key: string]: number | string | boolean | object
}

export default function SettingMainVersion() {
  useEffect(() => {
    async function getData() {
      const result: Response = await axios.get('/api/v1/setting/versionConfig')
      versionConfig = result.data.result
      console.log(versionConfig)
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
              {versionConfig.versionNum}
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
