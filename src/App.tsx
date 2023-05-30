import '@/lib/socket/index'

import { MessageOutlined } from '@ant-design/icons'
import { App as AntApp, ConfigProvider, FloatButton } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import routes from '~react-pages'

// import Layout from './components/layout'
// import Workbench from './components/workbench'
import ApiSearch from './components/ApiSearch'
import { useAppIntl } from './providers/IntlProvider'
import { primaryColor } from './styles'

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
      <AntApp>
        <ApiSearch />
        <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
        <FloatButton.Group className="global-float-btn" icon={<MessageOutlined />} trigger="click">
          <div className="p-2 bg-white rounded-lg flex flex-col items-center shadow-xl">
            <img
              src="https://fireboom.oss-cn-hangzhou.aliyuncs.com/img/qun_qr.png"
              className="w-45"
              alt="qun_qrcode"
            />
            <p>扫码加入开发者交流群</p>
          </div>
        </FloatButton.Group>
      </AntApp>
    </ConfigProvider>
  )
}
