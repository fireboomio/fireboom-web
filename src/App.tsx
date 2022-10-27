import { Suspense, useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'

import type { SystemConfigType } from '@/lib/context/ConfigContext'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import routes from '~react-pages'

// import Layout from './components/layout'
// import Workbench from './components/workbench'

export default function App() {
  const [config, setConfig] = useState<SystemConfigType>({} as SystemConfigType)
  useEffect(() => {
    void refreshConfig()
  }, [])
  const refreshConfig = async () => {
    void requests.get<unknown, SystemConfigType>('/setting/systemConfig').then(res => {
      setConfig(res)
    })
  }
  return (
    <ConfigContext.Provider value={{ config, refreshConfig }}>
      <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
    </ConfigContext.Provider>
  )
}
