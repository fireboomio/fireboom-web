import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useLayoutEffect, useMemo, useReducer } from 'react'
import { useImmer } from 'use-immer'

import { FileStoragePannel, FileStorageContainer } from '@/components/filestorage'
import type { FileStorageResp } from '@/interfaces/filestorage'
import { FSContext, FSDispatchContext, FSCurrFileContext, FSToggleContext } from '@/lib/context'
import requests from '@/lib/fetchers'
import storageReducer from '@/lib/reducers/storage-reducer'

import styles from './index.module.scss'

export default function FileStorage() {
  const [fileList, dispatch] = useReducer(storageReducer, [])
  const [currFSId, setCurrFSId] = useImmer(null as number | null | undefined)
  const [showType, setShowType] = useImmer('data')

  useLayoutEffect(() => {
    setCurrFSId(fileList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList])

  useEffect(() => {
    void requests
      .get<unknown, FileStorageResp[]>('/storageBucket')
      .then((data) => dispatch({ type: 'fetched', data }))
  }, [])

  const content = useMemo(() => fileList.find((b) => b.id === currFSId), [currFSId, fileList])

  function handleClickItem(fileStorageResp: FileStorageResp) {
    setShowType('data')
    setCurrFSId(fileStorageResp.id)
  }

  function handleToggleDesigner(value: 'content' | 'setEdit' | 'setCheck', id: number) {
    setShowType(value)
    setCurrFSId(id)
  }

  return (
    <FSContext.Provider value={fileList}>
      <FSDispatchContext.Provider value={dispatch}>
        <FSCurrFileContext.Provider value={{ currFSId, setCurrFSId }}>
          <FSToggleContext.Provider value={{ handleToggleDesigner }}>
            <Head>
              <title>FireBoom - 文件存储</title>
            </Head>

            <Row className="h-screen">
              <Col span={5} className={styles['col-left']}>
                <FileStoragePannel
                  onClickItem={handleClickItem}
                  handleToggleDesigner={handleToggleDesigner}
                />
              </Col>
              <Col span={19}>
                <FileStorageContainer showType={showType} content={content} />
              </Col>
            </Row>
          </FSToggleContext.Provider>
        </FSCurrFileContext.Provider>
      </FSDispatchContext.Provider>
    </FSContext.Provider>
  )
}
