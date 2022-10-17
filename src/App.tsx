import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import routes from '~react-pages'

// import Layout from './components/layout'
// import Workbench from './components/workbench'

export default function App() {
  return <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
}
