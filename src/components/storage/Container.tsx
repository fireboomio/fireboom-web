import { Button, Switch } from 'antd'
import { useContext } from 'react'

import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import StorageDetail from './subs/Detail'
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
    <div className="common-form h-full flex items-stretch justify-items-stretch flex-col">
      <div
        className="h-54px flex-0 bg-white flex items-center pl-11"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        <img src="/assets/ant-tree/file.png" className="w-14px h-14px mr-1.5" alt="文件" />
        {content?.name}
        <div className="flex-1"></div>
        {showType === 'detail' ? (
          <>
            <Switch
              checked={content?.switch === 1}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onChange={handleToggleBucket}
            />
            <Button
              className={'btn-save  ml-4 mr-11'}
              onClick={() => handleSwitch('form', content?.id)}
            >
              编辑
            </Button>
          </>
        ) : null}
      </div>
      <div
        className="rounded-4px flex-1 min-h-0 overflow-y-auto bg-white pl-8 mx-3 mt-3 pt-8"
        style={{
          border: '1px solid rgba(95,98,105,0.1)',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0'
        }}
      >
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
