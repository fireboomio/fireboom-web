import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { useImmer } from 'use-immer'

import { StorageContainer } from '@/components/storage'
import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import requests from '@/lib/fetchers'

export default function FileStorage() {
  const { id } = useParams()
  const [showType, setShowType] = useImmer<'explorer' | 'detail' | 'form'>('detail')
  const [content, setContent] = useState<StorageResp>()

  useEffect(() => {
    if (id === 'new') {
      setShowType('form')
      setContent(undefined)
      return
    }
    void requests.get<unknown, StorageResp[]>('/storageBucket').then(data => {
      setContent(data.filter(item => item.id === Number(id))[0])
      setShowType('detail')
    })
  }, [id, showType])

  function handleSwitch(value: 'explorer' | 'form' | 'detail', _id: number | undefined) {
    setShowType(value)
  }

  return (
    <>
      <Helmet>
        <title>FireBoom - 文件存储</title>
      </Helmet>
      <StorageSwitchContext.Provider value={{ handleSwitch }}>
        <StorageContainer showType={showType} content={content} />
      </StorageSwitchContext.Provider>
    </>
  )
}
