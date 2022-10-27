import { useContext, useEffect } from 'react'

import { WorkbenchContext } from '@/lib/context/workbenchContext'

export default function Rapi() {
  const { setFullscreen } = useContext(WorkbenchContext)

  useEffect(() => {
    setFullscreen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <iframe
      title="rapi"
      src="/#/rapi-frame"
      width={'100%'}
      height={'100%'}
      className="border-none"
    ></iframe>
  )
}
