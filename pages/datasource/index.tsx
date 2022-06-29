import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useLayoutEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { DatasourcePannel, DatasourceEditor } from '@/components/datasource'
import type { DatasourceResp, DatasourceItem } from '@/interfaces'
import {
  DatasourceContext,
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
} from '@/lib/context'
import { datasourceFetcher } from '@/lib/fetchers'

import datasourceReducer from './datasource-reducer'
import styles from './index.module.scss'

export default function Modeling() {
  const [datasourceList, dispatch] = useReducer(datasourceReducer, [] as DatasourceItem[])

  useLayoutEffect(() => {
    setCurrDBId(datasourceList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasourceList])

  const [currDBId, setCurrDBId] = useImmer(null as number | null | undefined)
  const { data: datasource, error } = useSWR<DatasourceResp[], Error>(
    '/api/datasource',
    datasourceFetcher
  )
  useEffect(() => {
    datasource &&
      dispatch({
        type: 'fetched',
        data: datasource.filter((item) => item.type == 'DB'),
      })
  }, [datasource])

  if (error) return <div>failed to load</div>
  if (!datasource) return <div>loading...</div>

  // TODO: need refine
  function handleChangeDStype(value: string) {
    datasource &&
      dispatch({
        type: 'fetched',
        data: datasource.filter((item) => item.type == value),
      })
  }

  const content = datasourceList.find((b) => b.id === currDBId) as DatasourceItem

  function handleClickItem(datasourceItem: DatasourceItem) {
    console.log(datasourceItem)
    setCurrDBId(datasourceItem.id)
  }

  return (
    <>
      <DatasourceContext.Provider value={datasourceList}>
        <DatasourceDispatchContext.Provider value={dispatch}>
          <DatasourceCurrDBContext.Provider value={{ currDBId, setCurrDBId }}>
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
                <DatasourceEditor content={content} />
              </Col>
            </Row>
          </DatasourceCurrDBContext.Provider>
        </DatasourceDispatchContext.Provider>
      </DatasourceContext.Provider>
    </>
  )
}
