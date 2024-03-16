import { simpleFetcher } from '@/lib/fetchers'
import { useMemo } from 'react'
import type { SWRConfiguration } from 'swr'
import useSWRImmutable from 'swr/immutable'

import { useEnv } from './env'

const FB_REPO_URL_MIRROR = 'FB_REPO_URL_MIRROR'
const FB_FILES_URL = 'FB_FILES_URL' 

const DEFAULT_ORG_NAME = 'fireboomio'

export function useFireboomFileContent<T = any>(filePath: string, options?: SWRConfiguration) {
  const { envs } = useEnv()

  const url = useMemo(() => {
    if (filePath) {
      return `${(envs[FB_FILES_URL] || 'https://files.fireboom.io').replace(/\/$/, '')}/${filePath}`
    }
    return null
  }, [envs[FB_FILES_URL]])

  return useSWRImmutable<T>(url, simpleFetcher, options)
}

export function useFireboomRepositoryUrl() {
  const { envs } = useEnv()

  return {
    getRepositoryUrl: (repositoryName: string) => {
      if (repositoryName && envs[FB_REPO_URL_MIRROR]) {
        if (repositoryName.match(/^https?:\/\//)) {
          return repositoryName
        }
        let orgName = DEFAULT_ORG_NAME
        if (repositoryName.includes('/')) {
          const [_orgName, _repositoryName] = repositoryName.split('/')
          orgName = _orgName
          repositoryName = _repositoryName
        }
        return envs[FB_REPO_URL_MIRROR].replace('{orgName}', orgName).replace(
          '{repoName}',
          repositoryName
        )
      }
      return null
    }
  }
}
