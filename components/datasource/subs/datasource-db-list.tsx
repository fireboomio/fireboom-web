import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import type { DatasourceItem } from '@/interfaces/datasource'
import { DatasourceContext, DatasourceDispatchContext } from '@/lib/context'

import DatasourceDBItem from './datasource-db-item'
import styles from './datasource-db-list.module.scss'

interface Props {
  onClickItem: (dsItem: DatasourceItem) => void
  Datasourcetype: string
  onToggleDesigner: (DatasourceItem: DatasourceItem) => void
}

export default function DatasourceDBList({ onClickItem, Datasourcetype, onToggleDesigner }: Props) {
  const datasourceList = useContext(DatasourceContext)
  const dispatch = useContext(DatasourceDispatchContext)

  const getNextId = () => Math.max(...datasourceList.map((b) => b.id)) + 1

  function addTable() {
    const data = { id: getNextId(), name: '', info: {}, type: Datasourcetype } as DatasourceItem
    dispatch({ type: 'added', data: data })
  }

  return (
    <>
      <div className="flex justify-between items-center p-4 border-[#5f62691a] border-b-1">
        <span className="text-sm font-medium leading-5 font-bold">数据概览</span>
        <div className="flex items-center">
          <Button
            className={styles['add-btn']}
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
            onClick={addTable}
          />
          <span className="text-sm font-medium leading-5 text-red-500 ml-2 tracking-wide ">
            新建DB
          </span>
        </div>
      </div>
      <div className="mt-3">
        {datasourceList.map((datasourceItem) => (
          <DatasourceDBItem
            key={datasourceItem.id}
            datasourceItem={datasourceItem}
            onClickItem={onClickItem}
            Datasourcetype={Datasourcetype}
            onToggleDesigner={onToggleDesigner}
          />
        ))}
      </div>
    </>
  )
}
