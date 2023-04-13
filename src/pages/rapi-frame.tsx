import { useContext, useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import type { GlobalSetting } from '@/interfaces/global'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'

if (window && document) {
  const script = document.createElement('script')
  const body = document.getElementsByTagName('body')[0]
  script.src = '//unpkg.com/rapidoc/dist/rapidoc-min.js'
  body.appendChild(script)
}

const id = `rapi-frame`

export default function RapiFrame() {
  const [params] = useSearchParams()
  const { system: config } = useContext(ConfigContext)
  const { data: global } = useSWRImmutable<GlobalSetting>('/setting/global', requests.get)
  const { search } = useLocation()
  const customServerUrl = config.apiPublicAddr
  const csrfToken = useRef('')

  useEffect(() => {
    if (global && config && global.configureWunderGraphApplication.security.enableCSRF) {
      /*
          Ensure that the DOM is loaded, then add the event listener.
          here we are listenig to 'before-try' event which fires when the user clicks
          on TRY, it then modifies the POST requests by adding a custom header
        */
      const rapidocEl = document.getElementById(id)
      rapidocEl!.addEventListener('spec-loaded', () => {
        fetch(`${customServerUrl}/auth/cookie/csrf`, {
          credentials: 'include'
        })
          .then(resp => resp.text())
          .then(text => {
            csrfToken.current = text!
          })
      })
      rapidocEl!.addEventListener('before-try', (e: any) => {
        if (e.detail.request.method === 'POST' && csrfToken.current) {
          e.detail.request.headers.append('X-CSRF-Token', csrfToken.current)
        }
      })
    }
  }, [global, config, customServerUrl])
  if (!config) return

  return (
    // @ts-ignore
    <rapi-doc
      id={id}
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
      fetch-credentials="include"
    />
  )
}
