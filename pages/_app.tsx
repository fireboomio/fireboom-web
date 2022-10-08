import 'antd/dist/antd.css'
// eslint-disable-next-line import/no-unresolved
import 'windi.css'
import '@/styles/globals.css'
// eslint-disable-next-line import/no-unassigned-import
import '../styles/ant-theme.scss'

import type { AppProps } from 'next/app'

import Layout from '@/components/layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
