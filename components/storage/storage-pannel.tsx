import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import type { StorageResp } from '@/interfaces/storage'
import { StorageContext, StorageDispatchContext } from '@/lib/context'

import styles from './storage-pannel.module.scss'
import StoragePannelItem from './subs/storage-pannel-item'

interface Props {
  onClickItem: (bucket: StorageResp) => void
  handleToggleDesigner: (value: 'editor' | 'viewer', id: number) => void
}

export default function StoragePannel({ onClickItem, handleToggleDesigner }: Props) {
  const bucketList = useContext(StorageContext)
  const dispatch = useContext(StorageDispatchContext)

  function addBucket() {
    const data = {
      config: '2',
      createTime: '2022',
      id: 1,
      isDel: 2,
      name: '2',
      switch: 2,
      updateTime: '2023',
    }
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
            onClick={addBucket}
          />
        </div>
      </div>

      <div className="mt-3">
        {bucketList.map((item) => (
          <StoragePannelItem
            key={item.id}
            bucket={item}
            onClickItem={onClickItem}
            handleToggleDesigner={handleToggleDesigner}
          />
        ))}
      </div>
    </>
  )
}
