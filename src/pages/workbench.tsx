import { Suspense, useContext } from 'react'
import { Outlet } from 'react-router-dom'

import { ConfigContext } from '@/lib/context/ConfigContext'
import Workbench from '@/pages/workbench/components/Workbench'

export default function WorkbenchPage() {
  const { globalSetting } = useContext(ConfigContext)
  if (!globalSetting) {
    return null
  }
  return (
    <Workbench>
      <Suspense>
        <Outlet />
      </Suspense>
    </Workbench>
  )
}
