import { Image } from 'antd'
import { isEmpty } from 'lodash'
import { CSSProperties, useEffect, useState } from 'react'

import { DOMAIN } from '@/lib/common'

import RcTab from '../rc-tab'
import Log from './Log'

const tabs = [
  { title: '终端', key: '0' },
  { title: '问题', key: '1' },
]
interface Props {
  style: CSSProperties
  toggleWindow: () => void
}

// eslint-disable-next-line react/prop-types
const Window: React.FC<Props> = ({ style, toggleWindow }) => {
  const [tabActiveKey, setTabActiveKey] = useState('0')
  const [log, setLog] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    void fetch(`${DOMAIN}/api/v1/wdg/log`).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) return

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)
          void data.text().then(x => setMsg(x))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
        // @ts-ignore
        void reader.read().then(process)
      }

      // @ts-ignore
      void reader.read().then(process)
    })
  }, [])

  useEffect(() => {
    let sym = '\n'
    if (isEmpty(log) || isEmpty(msg)) {
      sym = ''
    }
    setLog(`${log}${sym}${msg}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg])

  const extra = (
    <div className="flex justify-end cursor-pointer">
      <div className="">
        <Image
          src="/assets/clear.png"
          height={20}
          width={20}
          alt="清空"
          preview={false}
          onClick={() => setLog('')}
        />
      </div>
      <div className="ml-4">
        <Image src="/assets/download.png" height={20} width={20} alt="下载" preview={false} />
      </div>
      <div className="ml-4">
        <Image
          src="/assets/close.png"
          height={20}
          width={20}
          alt="关闭"
          preview={false}
          onClick={toggleWindow}
        />
      </div>
    </div>
  )

  return (
    <div
      className="absolute bottom-36px h-348px max-h-348px bg-[#fff] z-200 px-7 py-5 border"
      style={style}
    >
      <RcTab tabs={tabs} onTabClick={setTabActiveKey} activeKey={tabActiveKey} extra={extra} />
      {tabActiveKey === '0' ? <Log log={log} /> : <></>}
    </div>
  )
}

export default Window
