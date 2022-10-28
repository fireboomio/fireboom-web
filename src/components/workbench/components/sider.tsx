import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import ModelPannel from '@/pages/workbench/modeling/components/pannel'

import ApiPanel from './panel/apiPanel'
import CommonPanel from './panel/commonPanel'
import styles from './sider.module.less'

export default function Header() {
  const [tab, setTab] = useState<string>('')
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const tab = location.pathname.startsWith('/workbench/modeling') ? 'data' : 'api'
    setTab(tab)
  }, [location.pathname])
  const { panel } = useContext(PrismaSchemaContext)
  // const ctx = useContext(PrismaSchemaContext)
  const { handleToggleDesigner, handleClickEntity, handleChangeSource, setShowType, dataSources } =
    panel || {}

  return (
    <div className="flex flex-col h-full">
      <div className={styles.tabs}>
        <div className={styles.tabs_inner}>
          <div
            className={`${styles.tabs_tab} ${tab === 'api' ? styles.tabs_tab__active : ''}`}
            onClick={() => {
              setTab('api')
              navigate('/workbench')
            }}
          >
            <div className={styles.apiIcon} />
            API设计
          </div>
          <div
            className={`${styles.tabs_tab}  ${tab === 'data' ? styles.tabs_tab__active : ''}`}
            onClick={() => {
              setTab('data')
              navigate('/workbench/modeling')
            }}
          >
            <div className={styles.dataIcon} />
            数据建模
          </div>
        </div>
      </div>

      {tab === 'api' ? (
        <div className={styles.panels}>
          <ApiPanel
            open={location.pathname.startsWith('/workbench/apimanage/')}
            defaultOpen={location.pathname.startsWith('/workbench/apimanage/')}
          />
          <CommonPanel
            type="dataSource"
            defaultOpen={location.pathname.startsWith('/workbench/dataSource/')}
          />
          <CommonPanel type="auth" defaultOpen={location.pathname.startsWith('/workbench/auth/')} />
          <CommonPanel
            type="storage"
            defaultOpen={location.pathname.startsWith('/workbench/storage/')}
          />
        </div>
      ) : null}
      {tab === 'data' && panel ? (
        <ModelPannel
          setShowType={setShowType}
          changeToER={() => setShowType('erDiagram')}
          addNewModel={() => setShowType('newModel')}
          addNewEnum={() => setShowType('newEnum')}
          sourceOptions={dataSources}
          onChangeSource={dbSourceId => handleChangeSource(dbSourceId)}
          onClickEntity={handleClickEntity}
          onToggleDesigner={handleToggleDesigner}
        />
      ) : null}
    </div>
  )
}
