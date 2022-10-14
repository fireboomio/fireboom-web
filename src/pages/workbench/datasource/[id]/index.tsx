/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row } from 'antd'
import { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { useImmer } from 'use-immer'

import { DatasourceContainer } from '@/components/datasource'
import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import datasourceReducer from '@/lib/reducers/datasource-reducer'

export default function Datasource() {
  const navigate = useNavigate()
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const [datasource, dispatch] = useReducer(datasourceReducer, [])

  const [content, setContent] = useState<DatasourceResp>()
  const { id } = useParams()
  const [showType, setShowType] = useImmer<ShowType>('detail')

  useEffect(() => {
    // 当前状态为新建中且已选择数据源类型
    if (id === 'create') {
      if (!content) {
        navigate('/workbench/dataSource/new', { replace: true })
      }
      return
    }
    // 当前状态为新建中且未选择数据源类型
    if (id === 'new') {
      setContent(undefined)
      return
    }
    setShowType('detail')
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
      setContent(res.filter(x => x.id === Number(id))[0])
    })
  }, [id])

  const handleToggleDesigner = (type: ShowType, _id?: number, _sourceType?: number) => {
    //新增的item点击取消逻辑
    if (location.pathname === '/workbench/dataSource/create') {
      navigate('/workbench/dataSource/new', { replace: true })
    } else {
      setShowType(type)
    }
  }

  // if (error) return <div>failed to load</div>
  if (!datasource) return <div>loading...</div>

  // TODO: need refine

  return (
    <>
      <Helmet>
        <title>FireBoom - 数据来源</title>
      </Helmet>
      <DatasourceDispatchContext.Provider value={dispatch}>
        <DatasourceToggleContext.Provider
          value={{
            handleToggleDesigner,
            handleSave: content => {
              onRefreshMenu('dataSource')
              setContent(content)
              setShowType('detail')
              navigate(`/workbench/dataSource/${content.id}`, { replace: true })
            },
            handleCreate: content => {
              setShowType('form')
              setContent(content)
              navigate('/workbench/dataSource/create', { replace: true })
            }
          }}
        >
          <Row className="h-screen">
            <Col span={24}>
              <DatasourceContainer showType={showType} content={content} />
            </Col>
          </Row>
        </DatasourceToggleContext.Provider>
      </DatasourceDispatchContext.Provider>
    </>
  )
}
