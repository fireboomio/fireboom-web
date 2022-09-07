import { useState } from 'react'

import RcTab from '../rc-tab'
import Log from './Log'

const tabs = [
  { title: '终端', key: '0' },
  { title: '问题', key: '1' },
]

const Window: React.FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState('0')

  return (
    <div className="fixed w-full bottom-36px h-348px bg-[#fff] z-200 px-7 py-5 border">
      <RcTab tabs={tabs} onTabClick={setTabActiveKey} activeKey={tabActiveKey} />
      {tabActiveKey === '0' ? <Log /> : <></>}
    </div>
  )
}

export default Window
