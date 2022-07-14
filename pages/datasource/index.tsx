import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useLayoutEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { DatasourcePannel, DatasourceContainer } from '@/components/datasource'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceContext,
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
  DatasourceToggleContext,
} from '@/lib/context'
import { getFetcher } from '@/lib/fetchers'

import datasourceReducer from './datasource-reducer'
import styles from './index.module.scss'


export default function Datasource() {
  const [datasourceList, dispatch] = useReducer(datasourceReducer, [] as DatasourceResp[])
  const [showType, setShowType] = useImmer('data')
  useLayoutEffect(() => {
    setCurrDBId(datasourceList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasourceList])

  const [currDBId, setCurrDBId] = useImmer(null as number | null | undefined)
  const { data: datasource, error } = useSWR<DatasourceResp[], Error>(
    '/api/v1/dataSource',
    getFetcher<DatasourceResp[]>
  )
  
  useEffect(() => {
    datasource &&
      dispatch({
        type: 'fetched',
        data: datasource.filter((item) => item.source_type == 1),
      })
  }, [datasource])

  if (error) return <div>failed to load</div>
  if (!datasource) return <div>loading...</div>

  // TODO: need refine
  function handleChangeDStype(value: number) {
    datasource &&
      dispatch({
        type: 'fetched',
        data: datasource.filter((item) => item.source_type == value),
      })
    setShowType('data')
  }

  const content = datasourceList.find((b) => b.id === currDBId) as DatasourceResp

  function handleClickItem(datasourceItem: DatasourceResp) {
    setShowType('data')
    setCurrDBId(datasourceItem.id)
  }

  function handleToggleDesigner(type: string, id?: number) {
    setShowType(type)
    setCurrDBId(id)
  }

  return (
    <>
      <DatasourceContext.Provider value={datasourceList}>
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
