import { useMemo } from 'react'
import ReactJson from 'react-json-view'

import { useResponse } from './ResponseContext'

const ResponseViewer = () => {
  const resp = useResponse()

  const json = useMemo<object>(() => {
    try {
      return JSON.parse(resp.response) as object
    } catch (error) {
      return {}
    }
  }, [resp.response])

  const collapsedDeepth = useMemo(() => {
    if ('errors' in json) {
      return false
    }
    return 2
  }, [json])

  return <ReactJson src={json} iconStyle="triangle" collapsed={collapsedDeepth} name={false} />
}

export default ResponseViewer
