import { AppleOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { FileStorageItem } from '@/interfaces/filestorage'
interface Props {
  content: FileStorageItem
  showType: string
}

export default function FileStorageContainer({ content, showType }: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')

  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    if (content) {
      switch (showType) {
        case 'data':
          setViewer(<div>展示</div>)
          break
        case 'edit':
          setViewer(<div>编辑设置</div>)
          break
        default:
          setViewer(JSON.stringify(content))
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showType, content])

  return (
    <div className="pl-6 pr-10 mt-6">
      <div className="flex justify-start items-center mb-6 ">
        <span className="text-lg flex-grow font-bold">
          存储{showType == 'edit' ? ' / 存储配置' : ''}
        </span>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
