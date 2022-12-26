// import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import './styles/globals.css'
import './styles/ant-theme.less'

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import App from './App'
import IntlProvider from './providers/IntlProvider'

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(
  <HashRouter>
    <IntlProvider>
      <App />
    </IntlProvider>
  </HashRouter>
)
