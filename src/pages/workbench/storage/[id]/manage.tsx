import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useImmer } from 'use-immer'

import StorageExplorer from '@/components/storage/subs/Explorer'
import type { StorageResp } from '@/interfaces/storage'
import requests from '@/lib/fetchers'

export default function FileStorage() {
  const { id } = useParams()
  const [showType, setShowType] = useImmer<'explorer' | 'detail' | 'form'>('explorer')
  const [content, setContent] = useState<StorageResp>()

  useEffect(() => {
    if (id === 'new') {
      setShowType('form')
      setContent(undefined)
      return
    }
    void requests.get<unknown, StorageResp[]>('/storageBucket').then(data => {
      setContent(data.filter(item => item.id === Number(id))[0])
    })
  }, [id, setShowType])

  function handleSwitch(value: 'explorer' | 'form' | 'detail', _id: number | undefined) {
    setShowType(value)
  }

  return (
    <div className="h-full">
      <StorageExplorer bucketId={content?.id} key={content?.id} />
    </div>
  )
}
