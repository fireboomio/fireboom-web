import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import StorageExplorer from '@/components/storage/subs/Explorer'
import type { StorageResp } from '@/interfaces/storage'
import requests from '@/lib/fetchers'

export default function FileStorage() {
  const { id } = useParams()
  const [content, setContent] = useState<StorageResp>()

  useEffect(() => {
    void requests.get<unknown, StorageResp[]>('/storageBucket').then(data => {
      setContent(data.filter(item => item.id === Number(id))[0])
    })
  }, [id])

  return (
    <div className="h-full">
      <StorageExplorer bucketId={content?.id} key={content?.id} />
    </div>
  )
}
