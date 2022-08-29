import { PlusOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceContext, DatasourceDispatchContext } from '@/lib/context'

import styles from './Pannel.module.scss'
import DatasourceItem from './subs/PannelItem'

interface Props {
  onClickItem: (dsItem: DatasourceResp) => void
}
interface ListProps {
  onClickItem: (dsItem: DatasourceResp) => void
  datasourceType: number
}
const { Panel } = Collapse

function DatasourceList({ onClickItem, datasourceType }: ListProps) {
  const datasource = useContext(DatasourceContext)

  return (
    <>
      {datasource
        .filter(item => item.sourceType == datasourceType)
        .map(datasourceItem => {
          if (datasourceItem.name != '')
            return (
              <DatasourceItem
                key={datasourceItem.id}
                datasourceItem={datasourceItem}
                onClickItem={onClickItem}
              />
            )
        })}
    </>
  )
}

export default function DatasourcePannel({ onClickItem }: Props) {
  const dispatch = useContext(DatasourceDispatchContext)
  const datasource = useContext(DatasourceContext)
  const [activeKey, setActiveKey] = useImmer([] as Array<string>)
  const [hoveringKey, setHoveringKey] = useImmer(0)

  function addTable(datasourceType: number) {
    const data = {
      id: -(datasource.length + 1),
      name: '',
      config: {},
      sourceType: datasourceType,
      switch: 0,
    } as DatasourceResp
    dispatch({ type: 'added', data: data })
    onClickItem(data)
  }

  function setHeader(label: string, datasourceType: number) {
    return (
      <div
        className="w-full flex justify-between items-center py-2 pr-1 "
        onMouseEnter={() => {
          setHoveringKey(datasourceType)
        }}
        onMouseLeave={() => {
          setHoveringKey(0)
        }}
      >
        <span>{label}</span>
        {hoveringKey == datasourceType ? (
          <PlusOutlined
            onClick={event => {
              event.stopPropagation()
              setActiveKey(activeKey.concat(datasourceType.toString()))
              addTable(datasourceType)
            }}
          />
        ) : (
          ''
        )}
      </div>
    )
  }

  return (
    <>
      <div className={styles['datasource-collapse']}>
        <Collapse ghost bordered>
          <Panel header={<div className="w-52 flex justify-between py-2">外部数据源</div>} key={1}>
            <div className="h-40" style={{ overflow: 'auto' }}>
              <Collapse
                activeKey={activeKey}
                ghost
                bordered
                onChange={keys => setActiveKey(keys as string[])}
              >
                <Panel
                  header={setHeader('DB', 1)}
                  key={'1'}
                  className={styles['datasource-border']}
                >
                  <DatasourceList onClickItem={onClickItem} datasourceType={1} />
                </Panel>
                <Panel
                  header={setHeader('REST', 2)}
                  key={'2'}
                  className={styles['datasource-border']}
                >
                  <DatasourceList onClickItem={onClickItem} datasourceType={2} />
                </Panel>
                <Panel
                  header={setHeader('GraphQL', 3)}
                  key={'3'}
                  className={styles['datasource-border']}
                >
                  <DatasourceList onClickItem={onClickItem} datasourceType={3} />
                </Panel>
                <Panel
                  header={setHeader('自定义', 4)}
                  key={'4'}
                  className={styles['datasource-border']}
                >
                  <DatasourceList onClickItem={onClickItem} datasourceType={4} />
                </Panel>
              </Collapse>
            </div>
          </Panel>
        </Collapse>
      </div>
    </>
  )
}
