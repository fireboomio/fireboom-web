import { useContext } from 'react'
import { Outlet } from 'react-router-dom'

import Workbench from '@/components/workbench'
import { ConfigContext } from '@/lib/context/ConfigContext'

export default function WorkbenchPage() {
  const { config } = useContext(ConfigContext)
  if (!config) {
    return null
  }
  return (
    <Workbench>
      <Outlet />
    </Workbench>
  )
}
