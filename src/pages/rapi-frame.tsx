import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ConfigContext } from '@/lib/context/ConfigContext'

if (window && document) {
  const script = document.createElement('script')
  const body = document.getElementsByTagName('body')[0]
  script.src = '//unpkg.com/rapidoc/dist/rapidoc-min.js'
  body.appendChild(script)
}

export default function RapiFrame() {
  const [params] = useSearchParams()
  const { config } = useContext(ConfigContext)

  const customServerUrl =
    config.apiHost || `${location.protocol}//${location.hostname}:${config.apiPort}`

  if (!config) {
    return
  }
  return (
    // @ts-ignore
    <rapi-doc
      theme={params.get('theme') || 'light'}
      spec-url={params.get('url')}
      server-url={customServerUrl}
      default-api-server={customServerUrl}
      show-header="false"
      show-info="false"
      allow-authentication="false"
      allow-server-selection="false"
      allow-api-list-style-selection="false"
      render-style="read"
    />
  )
}
