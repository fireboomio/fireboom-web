import { useContext, useEffect } from 'react'

import { ConfigContext } from '@/lib/context/ConfigContext'

export default function RapiFrame() {
  const { config } = useContext(ConfigContext)
  useEffect(() => {
    if (window && document) {
      const script = document.createElement('script')
      const body = document.getElementsByTagName('body')[0]
      script.src = '//unpkg.com/rapidoc/dist/rapidoc-min.js'
      body.appendChild(script)
    }
  }, [])
  const customServerUrl =
    config.apiHost || `${location.protocol}//${location.hostname}:${config.apiPort}`

  if (!config) {
    return
  }
  return (
    // @ts-ignore
    <rapi-doc
      theme="dark"
      spec-url={`/api/v1/file/postToSwag`}
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
