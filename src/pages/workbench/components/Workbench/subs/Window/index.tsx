import { Resizable } from 're-resizable'
import type { CSSProperties } from 'react'
import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import Error from './Error'
import type { LogAction } from './Log'
import Log from './Log'
import RcTab from './RcTab'

interface Props {
  style: CSSProperties
  defaultTab?: string
  toggleWindow: () => void
}

// eslint-disable-next-line react/prop-types
const Window: React.FC<Props> = ({ style, toggleWindow, defaultTab }) => {
  const intl = useIntl()
  const tabs = useMemo(
    () => [
      { title: intl.formatMessage({ defaultMessage: '日志' }), key: '0' },
      { title: intl.formatMessage({ defaultMessage: '问题' }), key: '1' }
    ],
    [intl]
  )
  const [tabActiveKey, setTabActiveKey] = useState(defaultTab ?? '0')
  const logActionRef = useRef<LogAction>()
  const responseRef = useRef<Response>()
  const extra = (
    <div className="cursor-pointer flex justify-end">
      <div onClick={() => logActionRef.current?.clearLogs()}>
        <img src="/assets/clear.svg" height={20} width={20} alt="清空" />
      </div>
      <div className="ml-4" onClick={logActionRef.current?.downloadLogs}>
        <img src="/assets/download2.svg" height={20} width={20} alt="下载" />
      </div>
      <div className="ml-4" onClick={toggleWindow}>
        <img src="/assets/close2.svg" height={20} width={20} alt="关闭" />
      </div>
    </div>
  )

  return (
    <div
      className="bg-[#fff] border-gray-500/50 min-h-80px px-7 pb-5 bottom-36px z-1200  absolute"
      style={{
        borderTop: '1px solid #EFEFEFFF',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        ...style
      }}
    >
      <Resizable
        className="flex flex-col h-full pt-2.5"
        defaultSize={{ width: '100%', height: 348 }}
        minWidth="100%"
        maxWidth="100%"
        enable={{ top: true }}
      >
        <RcTab
          tabs={tabs}
          onTabClick={setTabActiveKey}
          activeKey={tabActiveKey}
          extra={extra}
          className="pb-2.5"
        />
        <div className={`w-full overflow-auto ${tabActiveKey === '0' ? '' : 'hidden'}`}>
          <Log actionRef={logActionRef} />{' '}
        </div>
        <div className={`w-full overflow-auto ${tabActiveKey === '1' ? '' : 'hidden'}`}>
          <Error />
        </div>
      </Resizable>
    </div>
  )
}

export default Window
