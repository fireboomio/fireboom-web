import '@/lib/socket/index'

import { App as AntApp, ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import type { ReactElement } from 'react'
import { Suspense, useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'

import routes from '~react-pages'

// import Layout from './components/layout'
// import Workbench from './components/workbench'
import ApiSearch from './components/ApiSearch'
import { useDict } from './providers/dict'
import { useEnv } from './providers/env'
import { useAppIntl } from './providers/IntlProvider'
import { useRole } from './providers/role'
import { primaryColor } from './styles'

console.log(routes)

export default function App() {
  const { locale } = useAppIntl()

  return (
    <ConfigProvider
      locale={{ 'zh-CN': zhCN, en: enUS }[locale]}
      theme={{
        token: {
          colorPrimary: primaryColor,
          zIndexPopupBase: 10000
        }
      }}
    >
      <ReadyWrapper>
        <AntApp>
          <ApiSearch />
          <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
        </AntApp>
      </ReadyWrapper>
    </ConfigProvider>
  )
}

function ReadyWrapper(props: { children: ReactElement }) {
  const { initialize: initializeDict } = useDict()
  const { initialize: initializeEnv } = useEnv()
  const { initialize: initializeRole } = useRole()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    Promise.all([initializeDict(), initializeEnv(), initializeRole()]).then(() => {
      setReady(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ready ? props.children : <div></div>
}
