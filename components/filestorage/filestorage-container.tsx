import { AppleOutlined } from '@ant-design/icons'

import type { FileStorageResp } from '@/interfaces/storage'

import FileStorageMainCheck from './subs/filestorage-main-check'
import FileStorageMainContent from './subs/filestorage-main-content'
import FileStorageMainSet from './subs/filestorage-main-set'

interface Props {
  content?: FileStorageResp
  showType: string
}

export default function FileStorageContainer({ content, showType }: Props) {
  const handleIconClick = () => {
    console.log('aaa')
  }

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
      {showType === 'data' ? (
        <FileStorageMainContent content={content} />
      ) : showType === 'setCheck' ? (
        <FileStorageMainCheck content={content} />
      ) : showType === 'setEdit' ? (
        <FileStorageMainSet content={content as FileStorageResp} />
      ) : (
        ''
      )}
    </div>
  )
}
