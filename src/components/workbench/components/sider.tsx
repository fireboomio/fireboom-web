import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import ModelPannel from '@/pages/workbench/modeling/components/pannel'
import { registerHotkeyHandler } from '@/services/hotkey'

import ApiPanel from './panel/apiPanel'
import CommonPanel from './panel/commonPanel'
import styles from './sider.module.less'

const tapPathMap: Record<string, string> = {
  api: '/workbench',
  data: '/workbench/modeling'
}

export default function Sider() {
  const [tab, setTab] = useState<string>('')
  const location = useLocation()
  const navigate = useNavigate()
  const { onRefreshMenu } = useContext(WorkbenchContext)

  // 快捷键
  useEffect(() => {
    return registerHotkeyHandler('alt+m', () => {
      if (location.pathname.startsWith('/workbench/modeling')) {
        navigate('/workbench')
      } else {
        navigate('/workbench/modeling')
      }
      setTab(tab)
    })
  }, [])

  useEffect(() => {
    const tab = location.pathname.startsWith('/workbench/modeling') ? 'data' : 'api'
    setTab(tab)
  }, [location.pathname])
  const { panel } = useContext(PrismaSchemaContext)
  // const ctx = useContext(PrismaSchemaContext)
  const { handleToggleDesigner, handleClickEntity, handleChangeSource, setShowType, dataSources } =
    panel || {}

  const changeTab = (targetTab: string) => {
    // 记住当前tab的路由
    tapPathMap[tab] = location.pathname
    // 切换tab
    // setTab(targetTab)
    // 跳转到目标tab默认路由
    navigate(tapPathMap[targetTab])
    // onRefreshMenu('api')
  }

  return (
    <div className="flex flex-col h-full">
      <div className={styles.tabs}>
        <div className={styles.tabs_inner}>
          <div
            className={`${styles.tabs_tab} ${tab === 'api' ? styles.tabs_tab__active : ''}`}
            onClick={() => {
              changeTab('api')
            }}
          >
            <div className={styles.apiIcon} />
            API设计
          </div>
          <div
            className={`${styles.tabs_tab}  ${tab === 'data' ? styles.tabs_tab__active : ''}`}
            onClick={() => {
              changeTab('data')
            }}
          >
            <div className={styles.dataIcon} />
            数据建模
          </div>
        </div>
      </div>

      {tab === 'api' ? (
        <div className={styles.panels}>
          <ApiPanel defaultOpen={location.pathname.startsWith('/workbench/apimanage/')} />
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
