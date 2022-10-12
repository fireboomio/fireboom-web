import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import {  useLocation } from 'react-router-dom'

import ApiPanel from './panel/apiPanel'
import CommonPanel from './panel/commonPanel'
import styles from './sider.module.scss'

export default function Header() {
  const [tab, setTab] = useState<string>('api')
  const location = useLocation()
  return (
    <div className="flex flex-col h-full">
      <div className={styles.tabs}>
        <div className={styles.tabs_inner}>
          <div
            className={`${styles.tabs_tab} ${tab === 'api' ? styles.tabs_tab__active : ''}`}
            onClick={() => setTab('api')}
          >
            <div className={styles.apiIcon} />
            API设计
          </div>
          <div
            className={`${styles.tabs_tab}  ${tab === 'data' ? styles.tabs_tab__active : ''}`}
            onClick={() => setTab('data')}
          >
            <div className={styles.dataIcon} />
            数据建模
          </div>
        </div>
      </div>

      <div className={styles.panels}>
        <ApiPanel defaultOpen={location.pathname.startsWith('/apimanage/')}/>
        <CommonPanel type="dataSource"  defaultOpen={location.pathname.startsWith('/dataSource/')}/>
        <CommonPanel type="auth"  defaultOpen={location.pathname.startsWith('/auth/')}/>
        <CommonPanel type="storage"  defaultOpen={location.pathname.startsWith('/storage/')}/>
      </div>
    </div>
  )
}
