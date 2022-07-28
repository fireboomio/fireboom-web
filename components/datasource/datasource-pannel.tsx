import { PlusOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceDispatchContext } from '@/lib/context'

import IconFont from '../iconfont'
import styles from './datasource-pannel.module.scss'
import DatasourceList from './subs/datasource-list'
interface Props {
  onClickItem: (dsItem: DatasourceResp) => void
}
const { Panel } = Collapse

export default function DatasourcePannel({ onClickItem }: Props) {
  const dispatch = useContext(DatasourceDispatchContext)
  const [activeKey, setActiveKey] = useImmer([] as Array<string>)

  function addTable(datasourceType: number) {
    const data = {
      id: 0,
      name: '',
      config: '2',
      // eslint-disable-next-line camelcase
      source_type: datasourceType,
      switch: 0,
    } as DatasourceResp
    dispatch({ type: 'added', data: data })
  }

  const genExtra = (datasourceType: number) => (
    <PlusOutlined
      onClick={(event) => {
        event.stopPropagation()
        setActiveKey(activeKey.concat(datasourceType.toString()))
        addTable(datasourceType)
      }}
    />
  )

  return (
    <>
      <div className={styles.pannel}>
        <div className={`${styles.title} text-base`}>
          外部数据源 <IconFont type="icon-wenjianshezhi" />
        </div>
      </div>

      <div className={styles['datasource-collapse']}>
        <Collapse ghost bordered>
          <Panel header="外部数据源" key={1}>
            <Collapse
              activeKey={activeKey}
              ghost
              bordered
              onChange={(keys) => {
                setActiveKey(keys as string[])
              }}
            >
              <Panel header="DB" key={'1'} extra={genExtra(1)}>
                <DatasourceList onClickItem={onClickItem} Datasourcetype={1} />
              </Panel>
              <Panel header="REST" key={'2'} extra={genExtra(2)}>
                <DatasourceList onClickItem={onClickItem} Datasourcetype={2} />
              </Panel>
              <Panel header="Graphal" key={'3'} extra={genExtra(3)}>
                <DatasourceList onClickItem={onClickItem} Datasourcetype={3} />
              </Panel>
              <Panel header="自定义" key={'4'} extra={genExtra(4)}>
                <DatasourceList onClickItem={onClickItem} Datasourcetype={4} />
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>
      </div>
    </>
  )
}
