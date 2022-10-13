import { Suspense } from 'react'
import {
  useRoutes,
} from 'react-router-dom'

// import Layout from './components/layout'
import Workbench from './components/workbench'

import routes from '~react-pages'

export default function App() {
  return (
      <Suspense fallback={<></>}>
        {useRoutes(routes)}
      </Suspense>
  )
}

