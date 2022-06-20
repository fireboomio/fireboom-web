import '@/styles/globals.css'
// eslint-disable-next-line import/no-unresolved
import 'windi.css'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
