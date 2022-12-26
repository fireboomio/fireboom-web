import { Button } from 'antd'
import { useContext, useEffect, useState } from 'react'

import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import StorageDetail from './subs/Detail'
import StorageForm from './subs/Form'

interface Props {
  content?: StorageResp
  showType: string
  showErr: boolean
}

export default function StorageContainer({ content, showType, showErr }: Props) {
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const { handleSwitch } = useContext(StorageSwitchContext)
  return (
    <div className="common-form h-full flex items-stretch justify-items-stretch flex-col">
      <div
        className="h-54px flex-0 bg-white flex items-center pl-11"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        <img src="/assets/ant-tree/file.png" className="w-14px h-14px mr-1.5" alt="文件" />
        {content?.name || '创建文件存储'}
        <div className="flex-1"></div>
        {showType === 'detail' ? (
          <>
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
        className="rounded-4px flex-1 min-h-0 overflow-y-auto bg-white px-8 mx-3 mt-3 pt-8"
        style={{
          border: '1px solid rgba(95,98,105,0.1)',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0'
        }}
      >
        {showType === 'detail' ? (
          <StorageDetail content={content} />
        ) : showType === 'form' ? (
          <StorageForm content={content} showErr={showErr} />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
