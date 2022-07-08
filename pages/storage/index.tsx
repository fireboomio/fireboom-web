import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { FileStoragePannel, FileStorageContainer } from '@/components/filestorage'
import type { FileStorageItem } from '@/interfaces/filestorage'
import { FSContext, FSDispatchContext, FSCurrFileContext } from '@/lib/context'
import { getFetcher } from '@/lib/fetchers'

import styles from './index.module.scss'
import storageReducer from './storage-reducer'

export default function FileStorage() {
  const [fileList, dispatch] = useReducer(storageReducer, [] as FileStorageItem[])
  const [showType, setShowType] = useImmer('data')
  useEffect(() => {
    setCurrFSId(fileList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList])

  const [currFSId, setCurrFSId] = useImmer(null as number | null | undefined)
  const { data, error } = useSWR<FileStorageItem[], Error>(
    '/api/v1/filestorage',
    getFetcher<FileStorageItem[]>
  )
  useEffect(() => {
    data &&
      dispatch({
        type: 'fetched',
        data,
      })
  }, [data])

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  // TODO: need refine

  const content = fileList.find((b) => b.id === currFSId) as FileStorageItem

  function handleClickItem(fileStorageItem: FileStorageItem) {
    setShowType('data')
    setCurrFSId(fileStorageItem.id)
  }

  function handleToggleDesigner(value: 'setEdit' | 'setCheck', id: number) {
    setShowType(value)
    setCurrFSId(id)
  }

  return (
    <>
      <FSContext.Provider value={fileList}>
        <FSDispatchContext.Provider value={dispatch}>
          <FSCurrFileContext.Provider value={{ currFSId, setCurrFSId }}>
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
          </FSCurrFileContext.Provider>
        </FSDispatchContext.Provider>
      </FSContext.Provider>
    </>
  )
}
