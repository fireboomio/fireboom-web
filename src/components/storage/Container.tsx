import { CaretRightOutlined } from '@ant-design/icons'
import { Button, Switch } from 'antd'
import { useContext } from 'react'

import IconFont from '@/components/iconfont'
import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import StorageDetail from './subs/Detail'
import StorageExplorer from './subs/Explorer'
import StorageForm from './subs/Form'

interface Props {
  content?: StorageResp
  showType: string
}

export default function StorageContainer({ content, showType }: Props) {
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const { handleSwitch } = useContext(StorageSwitchContext)
  const handleToggleBucket = async () => {
    if (!content) {
      return
    }
    content.switch ^= 1
    if (content) {
      void (await requests.put('/storageBucket ', content))
    }
    onRefreshMenu('storage')
    handleSwitch('detail', content?.id)
  }
  return (
    <div className="pt-3 px-3 h-full">
      <div className="rounded-4px h-full bg-white pl-8">
        <div className="flex items-center justify-between h-16">
          <span className="font-medium text-base text-default">
            {showType === 'form' ? '编辑' : '查看'}
          </span>
          {showType === 'form' ? (
            ''
          ) : (
            <div className="pr-3 pt-3">
              <Switch
                checked={content?.switch === 1}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={handleToggleBucket}
              />
              <Button
                className={'btn-light-full  ml-8'}
                onClick={() => handleSwitch('form', content?.id)}
              >
                编辑
              </Button>
            </div>
          )}
        </div>
        {showType === 'detail' ? (
          <StorageDetail content={content} />
        ) : showType === 'form' ? (
          <StorageForm content={content} />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
