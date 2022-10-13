import { CaretRightOutlined } from '@ant-design/icons'

import IconFont from '@/components/iconfont'
import type { StorageResp } from '@/interfaces/storage'

import StorageDetail from './subs/Detail'
import StorageExplorer from './subs/Explorer'
import StorageForm from './subs/Form'

interface Props {
  content?: StorageResp
  showType: string
}

export default function StorageContainer({ content, showType }: Props) {
  return (
    <div className="pl-6 pr-10 mt-6">
      <div className="flex justify-start items-center mb-5 ">
        <span className="text-lg flex-grow font-bold">
          <span className="font-bold text-18px">存储</span>
          {showType === 'form' ? (
            <>
              <CaretRightOutlined />
              存储配置
            </>
          ) : (
            <></>
          )}
        </span>
        <div className="space-x-4">
          <IconFont type="icon-lianxi" style={{ fontSize: '18px' }} />
          <IconFont type="icon-wenjian1" style={{ fontSize: '18px' }} />
          <IconFont type="icon-bangzhu" style={{ fontSize: '18px' }} />
        </div>
      </div>
      {showType === 'detail' ? (
        <StorageDetail content={content} />
      ) : showType === 'form' ? (
        <StorageForm content={content} />
      ) : (
        ''
      )}
    </div>
  )
}
