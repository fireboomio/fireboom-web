import { useContext, useEffect, useMemo, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { ConfigContext } from '@/lib/context/ConfigContext'
import { getAuthKey } from '@/lib/fetchers'
import { useConfigurationVariable } from '@/providers/variable'

if (window && document) {
  const script = document.createElement('script')
  const body = document.getElementsByTagName('body')[0]
  script.src = '/js/rapidoc-min.js'
  body.appendChild(script)
}

const id = `rapi-frame`

export default function RapiFrame() {
  const [params] = useSearchParams()
  const { globalSetting } = useContext(ConfigContext)
  const { search } = useLocation()

  const { getConfigurationValue } = useConfigurationVariable()
  const customServerUrl = useMemo(
    () => getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl),
    [getConfigurationValue, globalSetting.nodeOptions.publicNodeUrl]
  )
  const csrfToken = useRef('')

  useEffect(() => {
    if (globalSetting?.enableCSRFProtect) {
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
  }, [globalSetting, customServerUrl])
  if (!globalSetting) return

  return (
    // @ts-ignore
    <rapi-doc
      id={id}
      key={search}
      theme={params.get('theme') || 'light'}
      spec-url={params.get('url') + (getAuthKey() ? '?auth-key=' + getAuthKey() : '')}
      server-url={customServerUrl}
      default-api-server={customServerUrl}
      show-header="false"
      show-info="false"
      allow-authentication="true"
      allow-server-selection="false"
      allow-api-list-style-selection="false"
      render-style="focused"
      fetch-credentials="include"
    />
  )
}
