import { Image, Select, Tabs } from 'antd'
import React from 'react'

import styles from './ExperiencePreview.module.scss'

const { Option } = Select
const { TabPane } = Tabs

const ExperiencePreview: React.FC = () => {
  return (
    <div className={styles.experiencePreviewWrapper}>
      <div className={styles.experiencePreviewTitle}>
        <div className={styles.experiencePreviewTitleLeft}>
          <span>{'//'}</span>
          <span>登录预览</span>
        </div>
        <div className={styles.experiencePreviewTitleRight}>
          <Select defaultValue="英文" style={{ width: 120 }}>
            <Option value="英文">英文</Option>
            <Option value="中文">中文</Option>
          </Select>
          <Select defaultValue="浅色" style={{ width: 120 }}>
            <Option value="浅色">浅色</Option>
            <Option value="深色">深色</Option>
          </Select>
        </div>
      </div>
      <div className={styles.experiencePreviewDetailContent}>
        <Tabs
          tabPosition="top"
          animated={false}
          className={styles.tabStyle}
          centered
          type="card"
          defaultActiveKey="桌面网页"
        >
          <TabPane tab="桌面网页" key="桌面网页">
            <Image
              width="100%"
              height="100%"
              src="/assets/experience-preview.png"
              alt="FireBoom"
              preview={false}
            />
          </TabPane>
          <TabPane tab="移动网页" key="移动网页">
            <Image
              width="100%"
              height="100%"
              src="/assets/mobile-preview.png"
              alt="FireBoom"
              preview={false}
            />
          </TabPane>
          <TabPane tab="移动原生" key="移动原生">
            <Image
              width="100%"
              height="100%"
              src="/assets/mobile-preview.png"
              alt="FireBoom"
              preview={false}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}
export default ExperiencePreview
