import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { WorkbenchContext } from '@/lib/context/workbenchContext'

export default function Rapi() {
  const { setHideSide } = useContext(WorkbenchContext)
  const { url = '' } = useParams()

  useEffect(() => {
    setHideSide(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <iframe
      title="rapi"
      src={`/#/rapi-frame?url=${encodeURIComponent(url)}`}
      width={'100%'}
      height={'100%'}
      className="border-none"
    ></iframe>
  )
}
