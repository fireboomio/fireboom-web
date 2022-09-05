import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import { StorageContext, StorageSwitchContext } from '@/lib/context/storage-context'

import styles from './Pannel.module.scss'
import StoragePannelItem from './subs/PannelItem'

export default function StoragePannel() {
  const bucketList = useContext(StorageContext)
  const { handleSwitch } = useContext(StorageSwitchContext)

  function addBucket() {
    handleSwitch('form', undefined)
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
        {bucketList.map(item => (
          <StoragePannelItem key={item.id} bucket={item} />
        ))}
      </div>
    </>
  )
}
