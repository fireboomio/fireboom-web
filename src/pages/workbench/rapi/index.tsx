import { useContext, useEffect } from 'react'

import { WorkbenchContext } from '@/lib/context/workbenchContext'

export default function Rapi() {
  const { setHideSide } = useContext(WorkbenchContext)

  useEffect(() => {
    setHideSide(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <iframe
      title="rapi"
      src="/#/rapi-frame?url=/api/v1/file/postToSwag"
      width={'100%'}
      height={'100%'}
      className="border-none"
    ></iframe>
  )
}
