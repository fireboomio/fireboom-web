import { AppleOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './datasource-pannel.module.scss'
import DatasourceList from './subs/datasource-list'
interface Props {
  onClickItem: (dsItem: DatasourceItem) => void
  onChangeDBType: (value: string) => void
}

export default function DatasourcePannel({ onClickItem, onChangeDBType }: Props) {
  const { TabPane } = Tabs

  return (
    <>
      <div className={styles.pannel}>
        <div className={`${styles.title} text-base`}>
          外部数据源 <AppleOutlined />
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        onChange={(key: string) => {
          onChangeDBType(key)
        }}
        centered
        tabBarStyle={{ marginBottom: 0 }}
      >
        <TabPane tab="DB" key="DB">
          <DatasourceList onClickItem={onClickItem} Datasourcetype="DB" />
        </TabPane>
        <TabPane tab="REST" key="REST">
          <DatasourceList onClickItem={onClickItem} Datasourcetype="REST" />
        </TabPane>
        <TabPane tab="Graphal" key="Graphal">
          <DatasourceList onClickItem={onClickItem} Datasourcetype="Graphal" />
        </TabPane>
        <TabPane tab="自定义" key="defineByself">
          <DatasourceList onClickItem={onClickItem} Datasourcetype="defineByself" />
        </TabPane>
        <TabPane tab="存储" key="storage">
          <DatasourceList onClickItem={onClickItem} Datasourcetype="storage" />
        </TabPane>
      </Tabs>
    </>
  )
}
