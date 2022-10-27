import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import Workbench from '@/components/workbench'
import type { SystemConfigType } from '@/lib/context/ConfigContext'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'

export default function WorkbenchPage() {
  const [config, setConfig] = useState<SystemConfigType>()
  console.log('=====', config)
  useEffect(() => {
    void refreshConfig()
  }, [])
  const refreshConfig = async () => {
    void requests.get<unknown, SystemConfigType>('/setting/systemConfig').then(res => {
      setConfig(res)
    })
  }
  if (!config) {
    return null
  }
  return (
    <ConfigContext.Provider value={{ config, refreshConfig }}>
      <Workbench>
        <Outlet />
      </Workbench>
    </ConfigContext.Provider>
  )
}
