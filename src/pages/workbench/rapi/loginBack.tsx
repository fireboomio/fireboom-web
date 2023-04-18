import { useContext, useEffect } from 'react'

import { WorkbenchContext } from '@/lib/context/workbenchContext'

export default function Rapi() {
  const { setHideSide } = useContext(WorkbenchContext)

  useEffect(() => {
    window.open('/#/workbench/rapi?t=' + Date.now(), 'fb_rapi')
    setHideSide(true)
    window.close()
  }, [setHideSide])

  return ' '
}
