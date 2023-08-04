import { Suspense, useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { ConfigContext } from '@/lib/context/ConfigContext'
import Workbench from '@/pages/workbench/components/Workbench'
import { useDict } from '@/providers/dict'

export default function WorkbenchPage() {
  const { globalSetting } = useContext(ConfigContext)
  const { initialize } = useDict()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    initialize().then(() => {
      setReady(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!globalSetting) {
    return null
  }
  return (
    <Workbench>
      {ready && (
        <Suspense>
          <Outlet />
        </Suspense>
      )}
    </Workbench>
  )
}
