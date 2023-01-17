import { ConfigProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { Suspense, useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'

import type { SystemConfigType } from '@/lib/context/ConfigContext'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import routes from '~react-pages'

import { useAppIntl } from './providers/IntlProvider'

// import Layout from './components/layout'
// import Workbench from './components/workbench'

export default function App() {
  const { locale } = useAppIntl()
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
    <ConfigProvider locale={{ 'zh-CN': zhCN, en: enUS }[locale]}>
      <ConfigContext.Provider value={{ config, refreshConfig }}>
        <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
      </ConfigContext.Provider>
    </ConfigProvider>
  )
}
