/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row } from 'antd'
import { useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import { useImmer } from 'use-immer'

import { DatasourcePannel, DatasourceContainer } from '@/components/datasource'
import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import {
  DatasourceContext,
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
  DatasourceToggleContext,
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'
import datasourceReducer from '@/lib/reducers/datasource-reducer'

import styles from './index.module.scss'

export default function Datasource() {
  const [datasource, dispatch] = useReducer(datasourceReducer, [])
  const [showType, setShowType] = useImmer<ShowType>('detail')
  const [currDBId, setCurrDBId] = useImmer(null as number | null | undefined)

  useEffect(() => {
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
      dispatch({
        type: 'fetched',
        data: res,
      })
      setCurrDBId(res.filter(item => item.sourceType == 1).at(0)?.id)
    })
  }, [])

  const handleClickItem = (datasourceItem: DatasourceResp) => {
    if (datasourceItem.name == '') {
      setShowType('form')
    } else {
      setShowType('detail')
    }
    setCurrDBId(datasourceItem.id)
  }

  const handleToggleDesigner = (type: ShowType, id?: number, sourceType?: number) => {
    setShowType(type)
    //新增的item点击取消逻辑 // 0 会显示一个空页面
    if (id && id < 0) {
      setCurrDBId(datasource.filter(item => item.sourceType == sourceType).at(0)?.id || 0)
    } else setCurrDBId(id)
  }

  const content = datasource.find(b => b.id === currDBId) as DatasourceResp

  // if (error) return <div>failed to load</div>
  if (!datasource) return <div>loading...</div>

  // TODO: need refine

  return (
    <>
      <Helmet>
        <title>FireBoom - 数据来源</title>
      </Helmet>
      <DatasourceContext.Provider value={datasource}>
        <DatasourceDispatchContext.Provider value={dispatch}>
          <DatasourceCurrDBContext.Provider value={{ currDBId, setCurrDBId }}>
            <DatasourceToggleContext.Provider value={{ handleToggleDesigner }}>
              <Row className="h-screen">
                <Col span={5} className={styles['col-left']}>
                  <DatasourcePannel onClickItem={handleClickItem} />
                </Col>
                <Col span={19}>
                  <DatasourceContainer showType={showType} content={content} />
                </Col>
              </Row>
            </DatasourceToggleContext.Provider>
          </DatasourceCurrDBContext.Provider>
        </DatasourceDispatchContext.Provider>
      </DatasourceContext.Provider>
    </>
  )
}
