import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { WorkbenchContext } from '@/lib/context/workbenchContext'

export default function Rapi() {
  const { setHideSide } = useContext(WorkbenchContext)

  const { search } = useLocation()

  useEffect(() => {
    window.open('/#/workbench/rapi?t=' + Date.now(), 'fb_rapi')
    setHideSide(true)
    window.close()
  }, [])

  return ' '
}
