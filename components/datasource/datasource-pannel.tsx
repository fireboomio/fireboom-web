import { Tabs } from 'antd'

import type { DatasourceResp } from '@/interfaces/datasource'

import IconFont from '../iconfont'
import styles from './datasource-pannel.module.scss'
import DatasourceList from './subs/datasource-list'
interface Props {
  onClickItem: (dsItem: DatasourceResp) => void
  onChangeDBType: (value: number) => void
}

export default function DatasourcePannel({ onClickItem, onChangeDBType }: Props) {
  const { TabPane } = Tabs

  return (
    <>
      <div className={styles.pannel}>
        <div className={`${styles.title} text-base`}>
          外部数据源 <IconFont type="icon-wenjianshezhi" />
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        onChange={(key: string) => {
          onChangeDBType(Number(key))
        }}
        centered
        tabBarStyle={{ marginBottom: 0 }}
      >
        <TabPane tab="DB" key={1}>
          <DatasourceList onClickItem={onClickItem} Datasourcetype={1} />
        </TabPane>
        <TabPane tab="REST" key={2}>
          <DatasourceList onClickItem={onClickItem} Datasourcetype={2} />
        </TabPane>
        <TabPane tab="Graphal" key={3}>
          <DatasourceList onClickItem={onClickItem} Datasourcetype={3} />
        </TabPane>
        <TabPane tab="自定义" key={4}>
          <DatasourceList onClickItem={onClickItem} Datasourcetype={4} />
        </TabPane>
      </Tabs>
    </>
  )
}
