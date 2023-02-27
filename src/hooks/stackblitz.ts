import stackblizSDK from '@stackblitz/sdk'
import { useCallback, useState } from 'react'

import requests from '@/lib/fetchers'

interface DebugResp {
  dependFiles: Record<string, string>
  dependVersion: Record<string, string>
}

export type StackblitzProps = {
  // apiPublicAddr: string
}
export function useStackblitz() {
  const [loading, setLoading] = useState(false)
  const openHookServer = useCallback((openFile?: string | string[]) => {
    setLoading(true)
    requests
      .get(`/hook/dependFiles`)
      .then(resp => {
        const { dependFiles } = resp as unknown as DebugResp
        stackblizSDK.openProject(
          {
            template: 'node',
            title: 'Fireboom hooks online server',
            description: openFile ? (Array.isArray(openFile) ? openFile.join('\n') : openFile) : '',
            files: {
              ...Object.keys(dependFiles).reduce<Record<string, string>>((obj, fileName) => {
                obj[fileName] = dependFiles[fileName]
                return obj
              }, {})
            }
          },
          {
            newWindow: true,
            openFile
          }
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { openHookServer, loading }
}
