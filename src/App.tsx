import '@/lib/socket/index'

import { MessageOutlined } from '@ant-design/icons'
import { App as AntApp, ConfigProvider, FloatButton } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import type { ReactElement, ReactNode } from 'react'
import { Suspense, useEffect, useState } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'

import routes from '~react-pages'

// import Layout from './components/layout'
// import Workbench from './components/workbench'
import ApiSearch from './components/ApiSearch'
import { useDict } from './providers/dict'
import { useEnv } from './providers/env'
import { useAppIntl } from './providers/IntlProvider'
import { primaryColor } from './styles'

console.log(routes)

export default function App() {
  const { locale } = useAppIntl()
  const location = useLocation()

  const isRApiPage = location.pathname === '/rapi-frame'

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
          {!isRApiPage && (
            <FloatButton.Group
              className="global-float-btn"
              icon={<MessageOutlined />}
              trigger="click"
            >
              <div className="p-2 bg-white rounded-lg flex flex-col items-center shadow-xl">
                <img
                  src="https://fireboom.oss-cn-hangzhou.aliyuncs.com/img/qun_qr.png"
                  className="w-45"
                  alt="qun_qrcode"
                />
                <p>扫码加入开发者交流群</p>
              </div>
            </FloatButton.Group>
          )}
        </AntApp>
      </ReadyWrapper>
    </ConfigProvider>
  )
}

function ReadyWrapper(props: { children: ReactElement }) {
  const { initialize: initializeDict } = useDict()
  const { initialize: initializeEnv } = useEnv()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    Promise.all([initializeDict(), initializeEnv()]).then(() => {
      setReady(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ready ? props.children : <div></div>
}
