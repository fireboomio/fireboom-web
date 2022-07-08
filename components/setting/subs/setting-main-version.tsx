import { Descriptions, Divider } from 'antd'

import styles from './setting-main.module.scss'

export default function SettingMainVersion() {
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
              V1.2.0 <span className={styles['check-info']}>查看更新日志</span>
            </Descriptions.Item>
            <Descriptions.Item label="prisma版本">V1.2.0</Descriptions.Item>
            <Descriptions.Item label="版权">V1.2.0</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  )
}
