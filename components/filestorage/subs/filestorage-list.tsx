import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import type { FileStorageItem } from '@/interfaces/filestorage'
import { FSContext, FSDispatchContext } from '@/lib/context'

import styles from './filestorage-common-main.module.scss'
import FilesItem from './filestorage-item'


interface Props {
  onClickItem: (dsItem: FileStorageItem) => void
  handleToggleDesigner: (fileStorageItem: FileStorageItem) => void
}

export default function FileStorageList({ onClickItem, handleToggleDesigner }: Props) {
  const FSList = useContext(FSContext)
  const dispatch = useContext(FSDispatchContext)

  const getNextId = () => Math.max(...FSList.map((b) => b.id)) + 1

  function addTable() {
    const data = { id: getNextId(), name: '', info: {} } as FileStorageItem
    dispatch({ type: 'added', data: data })
  }

  return (
    <>
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
          <span className="text-base font-medium leading-5 text-red-500 ml-1 ">新建</span>
        </div>
      </div>
      <div className="mt-3">
        {FSList.map((fileItem) => (
          <FilesItem
            key={fileItem.id}
            fsItem={fileItem}
            onClickItem={onClickItem}
            handleToggleDesigner={handleToggleDesigner}
          />
        ))}
      </div>
    </>
  )
}
