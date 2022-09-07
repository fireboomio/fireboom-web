import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'

import { DOMAIN } from '@/lib/common'

import RcTab from '../rc-tab'
import Log from './Log'

const tabs = [
  { title: '终端', key: '0' },
  { title: '问题', key: '1' },
]

const Window: React.FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState('0')
  const [log, setLog] = useState('')

  useEffect(() => {
    // setInfo({
    //   errorInfo: { errTotal: 10, warnTotal: 22 },
    //   engineStatus: '启动中',
    //   hookStatus: '已停止',
    // })
    // return
    void fetch(`${DOMAIN}/api/v1/wdg/log`).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) {
          return
        }

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)
          void data.text().then(x =>
            setLog(() => {
              return isEmpty(log) ? x : `${log}\n${x}`
            })
          )
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

  return (
    <div className="fixed w-full bottom-36px h-348px max-h-348px bg-[#fff] z-200 px-7 py-5 border">
      <RcTab tabs={tabs} onTabClick={setTabActiveKey} activeKey={tabActiveKey} />
      {tabActiveKey === '0' ? <Log>{log}</Log> : <></>}
    </div>
  )
}

export default Window
