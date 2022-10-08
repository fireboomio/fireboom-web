import { Suspense } from 'react'
import {
  useRoutes,
} from 'react-router-dom'

import Layout from './components/layout'

import routes from '~react-pages'

// eslint-disable-next-line no-console
console.log(routes)

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<></>}>
        {useRoutes(routes)}
      </Suspense>
    </Layout>
  )
}

