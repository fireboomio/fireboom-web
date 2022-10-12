import { Outlet } from 'react-router-dom'

import Workbench from '@/components/workbench'

export default function WorkbenchPage() {
  return <Workbench>
    <Outlet />
  </Workbench>
}
