import { Button } from 'antd'
import { useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'

// import { WorkbenchContext } from '@/lib/context/workbenchContext'
import StorageDetail from './subs/Detail'
import StorageForm from './subs/Form'

interface Props {
  content?: StorageResp
  showType: string
  showErr: boolean
}

export default function StorageContainer({ content, showType, showErr }: Props) {
  const intl = useIntl()
  // const { onRefreshMenu } = useContext(WorkbenchContext)
  const { handleSwitch } = useContext(StorageSwitchContext)
  return (
    <div className="flex flex-col h-full common-form items-stretch justify-items-stretch">
      <div
        className="bg-white flex flex-0 h-54px pl-11 items-center"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        <img src="/assets/ant-tree/file.png" className="h-14px mr-1.5 w-14px" alt="文件" />
        {content?.name || intl.formatMessage({ defaultMessage: '创建文件存储' })}
        <div className="flex-1"></div>
        {showType === 'detail' ? (
          <>
            <Button
              className={'btn-save  ml-4 mr-11'}
              onClick={() => handleSwitch('form', content?.id)}
            >
              <FormattedMessage defaultMessage="编辑" />
            </Button>
          </>
        ) : null}
      </div>
      <div
        className="bg-white rounded-4px flex-1 mx-3 mt-3 min-h-0 px-8 pt-8 overflow-y-auto"
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
