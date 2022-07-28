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
  FSToggleContext,
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

  function handleClickItem(fileStorageResp: StorageResp) {
    setShowType('explorer')
    setCurrId(fileStorageResp.id)
  }

  function handleToggleDesigner(value: 'explorer' | 'editor' | 'viewer', id: number) {
    setShowType(value)
    setCurrId(id)
  }

  return (
    <StorageContext.Provider value={fileList}>
      <StorageDispatchContext.Provider value={dispatch}>
        <StorageCurrFileContext.Provider value={{ currId, setCurrId }}>
          <FSToggleContext.Provider value={{ handleToggleDesigner }}>
            <Head>
              <title>FireBoom - 文件存储</title>
            </Head>

            <Row className="h-screen">
              <Col span={5} className={styles['col-left']}>
                <StoragePannel
                  onClickItem={handleClickItem}
                  handleToggleDesigner={handleToggleDesigner}
                />
              </Col>
              <Col span={19}>
                <StorageContainer showType={showType} content={content} />
              </Col>
            </Row>
          </FSToggleContext.Provider>
        </StorageCurrFileContext.Provider>
      </StorageDispatchContext.Provider>
    </StorageContext.Provider>
  )
}
