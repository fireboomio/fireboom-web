// import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import './styles/globals.css'
import './styles/ant-theme.less'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
