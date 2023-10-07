import { useMemo } from 'react'

import JsonViewer from '@/components/JsonViewer'

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

  // const collapsedDeepth = useMemo(() => {
  //   if (typeof json === 'object') {
  //     if ('errors' in json) {
  //       return 3
  //     }
  //     return 2
  //   }
  //   return 2
  // }, [json])

  return <JsonViewer data={json} collapsed={3} />
}

export default ResponseViewer
