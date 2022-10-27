import { useEffect } from 'react'

export default function RapiFrame() {
  useEffect(() => {
    if (window && document) {
      const script = document.createElement('script')
      const body = document.getElementsByTagName('body')[0]
      script.src = '//unpkg.com/rapidoc/dist/rapidoc-min.js'
      body.appendChild(script)
    }
  }, [])

  return (
    // @ts-ignore
    <rapi-doc
      theme="dark"
      spec-url={`/api/v1/file/postToSwag`}
      // spec-url={`https://petstore.swagger.io/v2/swagger.json`}
      show-header="false"
      show-info="false"
      allow-authentication="false"
      allow-server-selection="false"
      allow-api-list-style-selection="false"
      render-style="read"
    />
  )
}
