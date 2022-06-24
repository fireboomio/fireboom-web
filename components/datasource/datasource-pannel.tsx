import { AppleOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces'

import { DatasourceContext } from './datasource-context'
import styles from './datasource-pannel.module.scss'
import ModelEntityList from './subs/datasource-db-list'

export default function DatasourcePannel() {
  const [DatasourceList, setDatasourceList] = useImmer([
    { id: 1, name: 'default_db', isEditing: false },
    { id: 2, name: 'mysql_ant', isEditing: false },
    { id: 3, name: 'mongodb_ant', isEditing: false },
    { id: 4, name: 'mongodb_ant', isEditing: false },
    { id: 5, name: 'default_db', isEditing: false },
    { id: 6, name: 'mysql_ant', isEditing: false },
  ] as DatasourceItem[])

  const { TabPane } = Tabs

  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <DatasourceContext.Provider value={{ DatasourceList, setDatasourceList }}>
      <div className={styles.pannel}>
        <div className={`${styles.title} text-base`}>
          外部数据源 <AppleOutlined />
        </div>
      </div>

      <Tabs defaultActiveKey="1" onChange={onChange} centered tabBarStyle={{ marginBottom: 0 }}>
        <TabPane tab="DB" key="1">
          <ModelEntityList />
        </TabPane>
        <TabPane tab="REST" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Graphal" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="自定义" key="4">
          Content of Tab Pane 4
        </TabPane>
      </Tabs>
    </DatasourceContext.Provider>
  )
}
