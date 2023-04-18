import '@/lib/socket/index'

import { App as AntApp, ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import routes from '~react-pages'

// import Layout from './components/layout'
// import Workbench from './components/workbench'
import ApiSearch from './components/ApiSearch'
import { useAppIntl } from './providers/IntlProvider'

export default function App() {
  const { locale } = useAppIntl()
  return (
    <ConfigProvider
      locale={{ 'zh-CN': zhCN, en: enUS }[locale]}
      theme={{
        token: {
          colorPrimary: '#E92E5E',
          zIndexPopupBase: 10000
        }
      }}
    >
      <AntApp>
        <ApiSearch />
        <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
      </AntApp>
    </ConfigProvider>
  )
}
