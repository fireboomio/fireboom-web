import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useImmer } from 'use-immer'

import { StorageSwitchContext } from '@/lib/context/storage-context'
import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

import StorageContainer from '../components/Container'

export default function FileStorage() {
  const { name } = useParams()
  const [showType, setShowType] = useImmer<'explorer' | 'detail' | 'form'>('detail')
  const [content, setContent] = useState<ApiDocuments.Storage>()
  const [showErr, setShowErr] = useState(false)

  useEffect(() => {
    if (name === 'new') {
      setShowType('form')
      setContent(undefined)
      setShowErr(false)
      return
    } else {
      if (name === sessionStorage.getItem('storageError')) {
        sessionStorage.removeItem('storageError')
        setShowErr(true)
        setShowType('form')
      } else {
        setShowErr(false)
        setShowType('detail')
      }
    }
  }, [name, setShowType])

  useEffect(() => {
    // 保存成功后跳转到详情页时顺便清空错误标记
    if (showType === 'detail' && showErr) {
      setShowErr(false)
    }
    if (name !== 'new') {
      requests.get<unknown, ApiDocuments.Storage>(`/storage/${name}`).then(data => {
        setContent(data)
      })
    }
  }, [name, showErr, showType])

  function handleSwitch(value: 'explorer' | 'form' | 'detail', name?: string) {
    setShowType(value)
  }

  return (
    <>
      <StorageSwitchContext.Provider value={{ handleSwitch }}>
        <StorageContainer showType={showType} content={content} showErr={showErr} />
      </StorageSwitchContext.Provider>
    </>
  )
}
