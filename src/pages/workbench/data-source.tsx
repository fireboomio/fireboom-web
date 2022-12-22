/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import datasourceReducer from '@/lib/reducers/datasource-reducer'

export default function DataSource() {
  const navigate = useNavigate()
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const [datasource, dispatch] = useReducer(datasourceReducer, [])

  const [content, setContent] = useState<DatasourceResp>()
  const { id } = useParams()
  const [showType, setShowType] = useImmer<ShowType>('detail')

  const { data: datasourceList, mutate } = useSWRImmutable<DatasourceResp[]>(
    ['/dataSource', id],
    function (url, id) {
      return requests.get(url)
    }
  )
  useEffect(() => {
    // 当前状态为新建中且已选择数据源类型
    if (id === 'create') {
      if (!content) {
        navigate('/workbench/data-source/new', { replace: true })
      }
      return
    }
    // 当前状态为新建中且未选择数据源类型
    if (id === 'new') {
      setContent(undefined)
      return
    }
    setShowType('detail')
  }, [id])
  useEffect(() => {
    if (id !== 'create' && id !== 'new') {
      setShowType('detail')
      setContent(datasourceList?.find(item => item.id === Number(id)))
    }
  }, [datasourceList, id])

  const handleToggleDesigner = (type: ShowType, _id?: number, _sourceType?: number) => {
    //新增的item点击取消逻辑
    if (location.pathname === '/workbench/data-source/create') {
      navigate('/workbench/data-source/new', { replace: true })
    } else {
      setShowType(type)
    }
  }

  // if (error) return <div>failed to load</div>

  // TODO: need refine
  console.log('content', content)

  return (
    <>
      <DatasourceDispatchContext.Provider value={dispatch}>
        <DatasourceToggleContext.Provider
          value={{
            showType,
            content,
            handleToggleDesigner,
            handleSave: content => {
              onRefreshMenu('dataSource')
              setContent(content)
              setShowType('detail')
              navigate(`/workbench/data-source/${content.id}`, { replace: true })
            },
            handleCreate: content => {
              setShowType('form')
              setContent(content)
              navigate('/workbench/data-source/create', { replace: true })
            }
          }}
        >
          <Outlet />
        </DatasourceToggleContext.Provider>
      </DatasourceDispatchContext.Provider>
    </>
  )
}
