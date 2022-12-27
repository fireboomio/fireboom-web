import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { useImmer } from 'use-immer'

import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import requests from '@/lib/fetchers'

import StorageContainer from '../components/Container'

export default function FileStorage() {
  const { id } = useParams()
  const [showType, setShowType] = useImmer<'explorer' | 'detail' | 'form'>('detail')
  const [content, setContent] = useState<StorageResp>()
  const [showErr, setShowErr] = useState(false)

  useEffect(() => {
    if (id === 'new') {
      setShowType('form')
      setContent(undefined)
      setShowErr(false)
      return
    } else {
      if (id === sessionStorage.getItem('storageError')) {
        sessionStorage.removeItem('storageError')
        setShowErr(true)
        setShowType('form')
      } else {
        setShowErr(false)
        setShowType('detail')
      }
    }
  }, [id])

  useEffect(() => {
    // 保存成功后跳转到详情页时顺便清空错误标记
    if (showType === 'detail' && showErr) {
      setShowErr(false)
    }
    void requests.get<unknown, StorageResp[]>('/storageBucket').then(data => {
      setContent(data?.filter(item => item.id === Number(id))?.[0])
    })
  }, [showType])

  function handleSwitch(value: 'explorer' | 'form' | 'detail', _id: number | undefined) {
    setShowType(value)
  }
  console.log('====================================', showErr)

  return (
    <>
      <Helmet>
        <title>FireBoom - 文件存储</title>
      </Helmet>
      <StorageSwitchContext.Provider value={{ handleSwitch }}>
        <StorageContainer showType={showType} content={content} showErr={showErr} />
      </StorageSwitchContext.Provider>
    </>
  )
}
