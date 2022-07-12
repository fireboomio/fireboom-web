import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import type { DatasourceResp, DatasourceRequst } from '@/interfaces/datasource'
import { DatasourceContext, DatasourceDispatchContext } from '@/lib/context'

import styles from './datasource-common-main.module.scss'
import DatasourceDBItem from './datasource-item'

interface Props {
  onClickItem: (dsItem: DatasourceResp) => void
  Datasourcetype: number
}

export default function DatasourceDBList({ onClickItem, Datasourcetype }: Props) {
  const datasourceList = useContext(DatasourceContext)
  const dispatch = useContext(DatasourceDispatchContext)

  function addTable() {
    const data = {
      name: '',
      config: '2',
      // eslint-disable-next-line camelcase
      source_type: Datasourcetype,
      switch: 0,
    } as DatasourceRequst
    dispatch({ type: 'added', data: data })
  }
  return (
    <>
      <div className="flex justify-between items-center p-15px border-[#5f62691a] border-b-1">
        <span className={`${styles['list-title']}`}>概览</span>
        <div className="flex items-center">
          <Button
            className={styles['add-btn']}
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
            onClick={addTable}
          />
        </div>
      </div>
      <div className="mt-3">
        {datasourceList.map((datasourceItem) => (
          <DatasourceDBItem
            key={datasourceItem.id}
            datasourceItem={datasourceItem}
            onClickItem={onClickItem}
            Datasourcetype={Datasourcetype}
          />
        ))}
      </div>
    </>
  )
}
