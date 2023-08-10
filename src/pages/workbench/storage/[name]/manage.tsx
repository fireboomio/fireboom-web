import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

import StorageExplorer from '../components/subs/Explorer'

export default function FileStorage() {
  const { name } = useParams()
  const [content, setContent] = useState<ApiDocuments.Storage>()

  useEffect(() => {
    void requests.get<unknown, ApiDocuments.Storage>(`/storage/${name}`).then(data => {
      setContent(data)
    })
  }, [name])

  return (
    <div className="h-full">
      <StorageExplorer bucketName={content?.name} key={content?.name} />
    </div>
  )
}
