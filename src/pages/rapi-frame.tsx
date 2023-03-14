import { useContext, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'

if (window && document) {
  const script = document.createElement('script')
  const body = document.getElementsByTagName('body')[0]
  script.src = '//unpkg.com/rapidoc/dist/rapidoc-min.js'
  body.appendChild(script)
}

export default function RapiFrame() {
  const [params] = useSearchParams()
  const { system: config } = useContext(ConfigContext)
  const { search } = useLocation()
  const customServerUrl = `${location.origin}`

  // const customServerUrl =
  //   'http://localhost:3000/api/v1/common/proxy?url=' + encodeURIComponent('http://localhost:9991')
  useEffect(() => {
    requests.get<unknown, any>('/auth').then(res => {
      console.log(res)
    })
  }, [search])
  if (!config) return

  return (
    // @ts-ignore
    <rapi-doc
      key={search}
      theme={params.get('theme') || 'light'}
      spec-url={params.get('url')}
      server-url={customServerUrl}
      default-api-server={customServerUrl}
      show-header="false"
      show-info="false"
      allow-authentication="true"
      allow-server-selection="false"
      allow-api-list-style-selection="false"
      render-style="read"
    />
  )
}
