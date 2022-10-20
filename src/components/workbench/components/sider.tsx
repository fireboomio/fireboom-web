import { PropsWithChildren, useEffect, useMemo, useReducer, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import type { DBSourceResp, Entity, ModelingShowTypeT } from '@/interfaces/modeling'
import {
  updateCurrentEntityIdAction,
  updatePreviewFiltersAction
} from '@/lib/actions/PrismaSchemaActions'
import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'
import {
  emptyPrismaSchemaContextState,
  PrismaSchemaContext
} from '@/lib/context/prismaSchemaContext'
import { fetchAndSaveToPrismaSchemaContext } from '@/lib/helpers/ModelingHelpers'
import modelingReducer from '@/lib/reducers/modelingReducers'
import ModelPannel from '@/pages/workbench/modeling/components/pannel'

import ApiPanel from './panel/apiPanel'
import CommonPanel from './panel/commonPanel'
import styles from './sider.module.less'

export default function Header() {
  const [tab, setTab] = useState<string>('api')
  const location = useLocation()
  const [state, dispatch] = useReducer(modelingReducer, emptyPrismaSchemaContextState.state)
  const [showType, setShowType] = useImmer<ModelingShowTypeT>('preview')
  const [dataSources, setDataSources] = useImmer<DBSourceResp[]>([])

  const { data, error } = useSWR(DATABASE_SOURCE, fetchDBSources)

  useEffect(() => {
    const tab = location.pathname.startsWith('/workbench/modeling') ? 'data' : 'api'
    setTab(tab)
  }, [location.pathname])

  useEffect(() => {
    setDataSources(data?.filter(ds => ds.sourceType === 1) ?? [])
  }, [data, setDataSources])

  useEffect(() => {
    if (dataSources.length > 0) {
      fetchAndSaveToPrismaSchemaContext(dataSources[0].id, dispatch, dataSources)
    }
  }, [dataSources])

  const handleChangeSource = (dbSourceId: number) => {
    console.log(dbSourceId)
    fetchAndSaveToPrismaSchemaContext(dbSourceId, dispatch, dataSources)
    setShowType('preview')
  }

  const handleClickEntity = (entity: Entity) => {
    setShowType(entity?.type === 'enum' ? 'editEnum' : 'preview')
    dispatch(updateCurrentEntityIdAction(entity.id))
    dispatch(updatePreviewFiltersAction([]))
  }

  const handleToggleDesigner = (entity: Entity) => {
    setShowType(entity.type === 'model' ? 'editModel' : 'editEnum')
    dispatch(updateCurrentEntityIdAction(entity.id))
  }

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
      ) : (
        <PrismaSchemaContext.Provider value={{ state, dispatch }}>
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
        </PrismaSchemaContext.Provider>
      )}
    </div>
  )
}
