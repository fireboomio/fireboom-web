import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import type { StorageResp } from '@/interfaces/storage'
import requests from '@/lib/fetchers'

import StorageExplorer from '../components/subs/Explorer'

export default function FileStorage() {
  const { id } = useParams()
  const [content, setContent] = useState<StorageResp>()

  useEffect(() => {
    void requests.get<unknown, StorageResp[]>('/storage').then(data => {
      setContent(data?.filter(item => item.id === Number(id))?.[0])
    })
  }, [id])

  return (
    <div className="h-full">
      <StorageExplorer bucketId={content?.id} key={content?.id} />
    </div>
  )
}
