import { AppleOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './datasource-pannel.module.scss'
import DatasourceList from './subs/datasource-list'
interface Props {
  onClickItem: (dsItem: DatasourceItem) => void
  onChangeDBType: (value: string) => void
  onToggleDesigner: (DatasourceItem: DatasourceItem) => void
}

export default function DatasourcePannel({ onClickItem, onChangeDBType, onToggleDesigner }: Props) {
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
          <DatasourceList
            onClickItem={onClickItem}
            Datasourcetype="DB"
            onToggleDesigner={onToggleDesigner}
          />
        </TabPane>
        <TabPane tab="REST" key="REST">
          <DatasourceList
            onClickItem={onClickItem}
            Datasourcetype="REST"
            onToggleDesigner={onToggleDesigner}
          />
        </TabPane>
        <TabPane tab="Graphal" key="Graphal">
          <DatasourceList
            onClickItem={onClickItem}
            Datasourcetype="Graphal"
            onToggleDesigner={onToggleDesigner}
          />
        </TabPane>
        <TabPane tab="自定义" key="4">
          <DatasourceList
            onClickItem={onClickItem}
            Datasourcetype="defineByself"
            onToggleDesigner={onToggleDesigner}
          />
        </TabPane>
      </Tabs>
    </>
  )
}
