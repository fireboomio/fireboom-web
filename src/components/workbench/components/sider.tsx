import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import ApiPanel from './panel/apiPanel'
import CommonPanel from './panel/commonPanel'
import styles from './sider.module.scss'

export default function Header() {
  const [tab, setTab] = useState<string>('api')
  return (
    <div className="flex flex-col h-full">
      <div className={styles.tabs}>
        <div className={styles.tabs_inner}>
          <div
            className={`${styles.tabs_tab} ${tab === 'api' ? styles.tabs_tab__active : ''}`}
            onClick={() => setTab('api')}
          >
            API设计
          </div>
          <div
            className={`${styles.tabs_tab}  ${tab === 'data' ? styles.tabs_tab__active : ''}`}
            onClick={() => setTab('data')}
          >
            数据建模
          </div>
        </div>
      </div>

      <div className={styles.panels}>
        <ApiPanel defaultOpen />
        <CommonPanel type="dataSource" />
        <CommonPanel type="auth" />
        <CommonPanel type="storage" />
      </div>
    </div>
  )
}
