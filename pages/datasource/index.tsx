import { Col, Row } from 'antd'
import Head from 'next/head'
import { useLayoutEffect, useReducer } from 'react'
import { useImmer } from 'use-immer'

import { DatasourcePannel, DatasourceEditor } from '@/components/datasource'
import type { DatasourceItem } from '@/interfaces'
import {
  DatasourceContext,
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
} from '@/lib/context'

import datasourceReducer from './datasource-reducer'
import styles from './index.module.scss'

const datasourcelistorigin = [
  { id: 1, name: 'default_db', isEditing: false, type: 'DB' },
  { id: 2, name: 'mysql_ant', isEditing: false, type: 'DB' },
  { id: 3, name: 'mongodb_ant', isEditing: false, type: 'DB' },
  { id: 4, name: 'mongodb_ant', isEditing: false, type: 'REST' },
  { id: 5, name: 'default_db', isEditing: false, type: 'REST' },
  { id: 6, name: 'mysql_ant', isEditing: false, type: 'Graphal' },
  { id: 7, name: 'mysql_ant', isEditing: false, type: 'Graphal' },
]
export default function Modeling() {
  const [datasourceList, dispatch] = useReducer(
    datasourceReducer,
    datasourcelistorigin as DatasourceItem[]
  )

  const [currDBId, setCurrDBId] = useImmer(null as number | null | undefined)

  // TODO: need refine
  useLayoutEffect(() => {
    setCurrDBId(datasourceList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasourceList])

  function handleChangeDStype(value: string) {
    dispatch({
      type: 'fetched',
      data: datasourcelistorigin.filter((item) => item.type == value),
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
