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
  const [fileList, dispatch] = useReducer(storageReducer, [])
  const [currId, setCurrId] = useImmer(null as number | null | undefined)
  const [showType, setShowType] = useImmer<'explorer' | 'viewer' | 'editor'>('explorer')

  useLayoutEffect(() => {
    setCurrId(fileList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList])

  useEffect(() => {
    void requests
      .get<unknown, StorageResp[]>('/storageBucket')
      .then((data) => dispatch({ type: 'fetched', data }))
  }, [])

  const content = useMemo(() => fileList.find((b) => b.id === currId), [currId, fileList])

  function handleSwitch(id: number, value: 'explorer' | 'editor' | 'viewer') {
    setCurrId(id)
    setShowType(value)
  }

  return (
    <StorageContext.Provider value={fileList}>
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
                <StorageContainer showType={showType} content={content} />
              </Col>
            </Row>
          </StorageSwitchContext.Provider>
        </StorageCurrFileContext.Provider>
      </StorageDispatchContext.Provider>
    </StorageContext.Provider>
  )
}
