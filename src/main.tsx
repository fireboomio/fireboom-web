// import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import './styles/globals.css'
import './styles/ant-theme.less'
import 'react-json-view-lite/dist/index.css'

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import App from './App'
import Authentication from './components/Authentication'
import IntlProvider from './providers/IntlProvider'

// console.log('fe version: ', '0.1.0')
const container = document.getElementById('app')
const root = createRoot(container!)
root.render(
  <IntlProvider>
    <Authentication>
      <HashRouter>
        <App />
      </HashRouter>
    </Authentication>
  </IntlProvider>
)
