import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useLayoutEffect, useMemo, useReducer } from 'react'
import { useImmer } from 'use-immer'

import { StoragePannel, StorageContainer } from '@/components/storage'
import type { StorageResp } from '@/interfaces/storage'
import {
  StorageContext,
  StorageDispatchContext,
  StorageCurrFileContext,
  StorageSwitchContext,
} from '@/lib/context'
import requests from '@/lib/fetchers'
import storageReducer from '@/lib/reducers/storage-reducer'

import styles from './index.module.scss'

export default function FileStorage() {
  const [bucketList, dispatch] = useReducer(storageReducer, [])
  const [currId, setCurrId] = useImmer<number | undefined>(undefined)
  const [showType, setShowType] = useImmer<'explorer' | 'detail' | 'form'>('explorer')

  useLayoutEffect(() => {
    setCurrId(bucketList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketList])

  useEffect(() => {
    void requests
      .get<unknown, StorageResp[]>('/storageBucket')
      .then((data) => dispatch({ type: 'fetched', data }))
  }, [])

  const content = useMemo(() => bucketList.find((b) => b.id === currId), [currId, bucketList])

  function handleSwitch(id: number, value: 'explorer' | 'form' | 'detail') {
    setCurrId(id)
    setShowType(value)
  }

  return (
    <StorageContext.Provider value={bucketList}>
      <StorageDispatchContext.Provider value={dispatch}>
        <StorageCurrFileContext.Provider value={{ currId, setCurrId }}>
          <StorageSwitchContext.Provider value={{ handleSwitch }}>
            <Head>
              <title>FireBoom - 文件存储</title>
            </Head>

            <Row className="h-screen">
              <Col span={5} className={styles['col-left']}>
                <StoragePannel />
              </Col>
              <Col span={19}>
                <StorageContainer showType={showType} content={content as StorageResp} />
              </Col>
            </Row>
          </StorageSwitchContext.Provider>
        </StorageCurrFileContext.Provider>
      </StorageDispatchContext.Provider>
    </StorageContext.Provider>
  )
}
