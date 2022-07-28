import { AppleOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { FileStorageResp } from '@/interfaces/filestorage'

import FileStorageMainCheck from './subs/filestorage-main-check'
import FileStorageMainContent from './subs/filestorage-main-content'
import FileStorageMainSet from './subs/filestorage-main-set'

interface Props {
  content: FileStorageResp | undefined
  showType: string
}

export default function FileStorageContainer({ content, showType }: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')

  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    if (content) {
      console.log(showType)
      switch (showType) {
        case 'data':
          setViewer(<FileStorageMainContent content={content} />)
          break
        case 'setCheck':
          setViewer(<FileStorageMainCheck content={content} />)
          break
        case 'setEdit':
          setViewer(<FileStorageMainSet content={content} />)
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
      <div className="flex justify-start items-center mb-5 ">
        <span className="text-lg flex-grow font-bold">
          存储{showType == 'edit' ? '' : ' / 存储配置'}
        </span>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
