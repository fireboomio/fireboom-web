import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import { DatasourceContext } from '../datasource-context'
import ModelEntityItem from './datasource-DB-item'
import styles from './datasource-DB-list.module.scss'

export default function DatasourceDBList() {
  const { DatasourceList, setDatasourceList } = useContext(DatasourceContext)

  function addTable() {
    setDatasourceList(
      DatasourceList.concat({ id: DatasourceList.length + 1, name: '', isEditing: true })
    )
  }

  return (
    <>
      <div className="flex justify-between items-center p-4 border-[#5f62691a] border-b-1 border-t-1">
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
        {DatasourceList.map((DatasourceItem) => (
          <ModelEntityItem key={DatasourceItem.id} entity={DatasourceItem} />
        ))}
      </div>
    </>
  )
}
