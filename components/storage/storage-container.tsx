import { AppleOutlined } from '@ant-design/icons'

import type { StorageResp } from '@/interfaces/storage'

import StorageEditor from './subs/storage-editor'
import StorageExplorer from './subs/storage-explorer'
import StorageViewer from './subs/storage-viewer'

interface Props {
  content?: StorageResp
  showType: string
}

export default function StorageContainer({ content, showType }: Props) {
  const handleIconClick = () => {
    console.log('aaa')
  }

  return (
    <div className="pl-6 pr-10 mt-6">
      <div className="flex justify-start items-center mb-5 ">
        <span className="text-lg flex-grow font-bold">
          存储{showType == 'editor' ? '' : ' / 存储配置'}
        </span>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
      </div>
      {showType === 'explorer' ? (
        <StorageExplorer content={content} />
      ) : showType === 'viewer' ? (
        <StorageViewer content={content} />
      ) : showType === 'editor' ? (
        <StorageEditor content={content as StorageResp} />
      ) : (
        ''
      )}
    </div>
  )
}
