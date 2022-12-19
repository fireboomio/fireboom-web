import type { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import { useCallback, useState } from 'react'

import styles from './index.module.less'

type TabItem = {
  title: string
  key: string
}

type RcTabProps = {
  className?: string
  tabs: TabItem[]
  extra?: ReactNode
  activeKey?: string
  onTabClick?: Dispatch<SetStateAction<string>>
}

const RcTab: FC<RcTabProps> = props => {
  const [activeKey, setActiveKey] = useState(props.activeKey ?? props.tabs[0].key)
  const handleClick = useCallback(
    (key: string) => {
      setActiveKey(key)
      props.onTabClick?.(key)
    },
    [props]
  )

  const isActive = useCallback(
    (key: string) => {
      return props.activeKey ? props.activeKey === key : activeKey === key
    },
    [props.activeKey, activeKey]
  )

  return (
    <div className={props.className}>
      <div className="flex justify-between">
        <div className="flex space-x-6">
          {props.tabs.map(i => (
            <div
              key={i.key}
              className={`text-[#252B3A]  cursor-pointer leading-20px ${
                isActive(i.key) ? styles.active : ''
              }`}
              onClick={() => handleClick(i.key)}
            >
              {i.title}
            </div>
          ))}
        </div>
        {props.extra}
      </div>
    </div>
  )
}

export default RcTab
