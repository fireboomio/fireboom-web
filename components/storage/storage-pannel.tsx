/* eslint-disable camelcase */

import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import type { StorageResp } from '@/interfaces/storage'
import { FSContext, FSDispatchContext } from '@/lib/context'

import styles from './storage-pannel.module.scss'
import StoragePannelItem from './subs/storage-pannel-item'

interface Props {
  onClickItem: (fsItem: StorageResp) => void
  handleToggleDesigner: (value: 'setEdit' | 'setCheck', id: number) => void
}

export default function StoragePannel({ onClickItem, handleToggleDesigner }: Props) {
  const FSList = useContext(FSContext)
  const dispatch = useContext(FSDispatchContext)

  function addTable() {
    const data = {
      config: '2',
      create_time: '2022',
      id: 1,
      is_del: 2,
      name: '2',
      switch: 2,
      update_time: '2023',
    } as StorageResp
    dispatch({ type: 'added', data: data })
  }

  return (
    <>
      <div className="border-gray border-b ">
        <div className={`${styles.title} text-lg font-bold mt-6 ml-4 mb-8`}>存储</div>
      </div>

      <div className="flex justify-between items-center p-4 border-[#5f62691a] border-b-1">
        <span className="text-base  leading-5 font-bold">概览</span>
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
        {FSList.map((fsItem) => (
          <StoragePannelItem
            key={fsItem.id}
            fsItem={fsItem}
            onClickItem={onClickItem}
            handleToggleDesigner={handleToggleDesigner}
          />
        ))}
      </div>
    </>
  )
}
