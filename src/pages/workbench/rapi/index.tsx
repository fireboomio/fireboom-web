import { useContext, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { getAuthKey } from '@/lib/fetchers'

export default function Rapi() {
  const { setHideSide } = useContext(WorkbenchContext)

  const { search } = useLocation()

  useEffect(() => {
    setHideSide(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <iframe
      key={search}
      title="rapi"
      src="/#/rapi-frame?url=/api/file/postToSwag"
      width={'100%'}
      height={'100%'}
      className="border-none"
    />
  )
}
