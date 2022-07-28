/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import { useImmer } from 'use-immer'

import { DatasourcePannel, DatasourceContainer } from '@/components/datasource'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceContext,
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
  DatasourceToggleContext,
} from '@/lib/context'
import requests from '@/lib/fetchers'
import datasourceReducer from '@/lib/reducers/datasource-reducer'

import styles from './index.module.scss'

export default function Datasource() {
  const [datasource, dispatch] = useReducer(datasourceReducer, [])
  const [showType, setShowType] = useImmer('data')
  const [currDBId, setCurrDBId] = useImmer(null as number | null | undefined)

  useEffect(() => {
    requests
      .get<unknown, DatasourceResp[]>('/dataSource')
      .then((res) => {
        dispatch({
          type: 'fetched',
          data: res,
        })
        setCurrDBId(res.filter((item) => item.source_type == 1).at(0)?.id)
      })
      .catch(() => {
        console.log('get Datasource Data Error')
      })
  }, [])

  const handleChangeDStype = (value: number) => {
    setShowType('data')
    setCurrDBId(datasource.filter((item) => item.source_type == value).at(0)?.id)
  }

  const handleClickItem = (datasourceItem: DatasourceResp) => {
    setShowType('data')
    setCurrDBId(datasourceItem.id)
  }

  const handleToggleDesigner = (type: string, id?: number) => {
    setShowType(type)
    setCurrDBId(id)
  }

  const content = datasource.find((b) => b.id === currDBId) as DatasourceResp

  // if (error) return <div>failed to load</div>
  if (!datasource) return <div>loading...</div>

  // TODO: need refine

  return (
    <>
      <DatasourceContext.Provider value={datasource}>
        <DatasourceDispatchContext.Provider value={dispatch}>
          <DatasourceCurrDBContext.Provider value={{ currDBId, setCurrDBId }}>
            <DatasourceToggleContext.Provider value={{ handleToggleDesigner }}>
              <Head>
                <title>FireBoom - 数据来源</title>
              </Head>
              <Row className="h-screen">
                <Col span={5} className={styles['col-left']}>
                  <DatasourcePannel
                    onClickItem={handleClickItem}
                    onChangeDBType={handleChangeDStype}
                  />
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
