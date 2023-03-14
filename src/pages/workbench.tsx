import { Suspense, useContext } from 'react'
import { Outlet } from 'react-router-dom'

import { ConfigContext } from '@/lib/context/ConfigContext'
import Workbench from '@/pages/workbench/components/Workbench'

export default function WorkbenchPage() {
  const { system: config } = useContext(ConfigContext)
  if (!config) {
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
