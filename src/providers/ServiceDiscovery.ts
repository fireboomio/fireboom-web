import { useMemo } from 'react'
import type { SWRConfiguration } from 'swr'
import useSWRImmutable from 'swr/immutable'

import { proxy } from '@/lib/fetchers'

import { useEnv } from './env'

const FB_REPO_URL_MIRROR = 'FB_REPO_URL_MIRROR'
const FB_RAW_URL_MIRROR = 'FB_RAW_URL_MIRROR'

const DEFAULT_ORG_NAME = 'fireboomio'

export function useFireboomFileContent<T = any>(filePath: string, options?: SWRConfiguration) {
  const { envs } = useEnv()

  const url = useMemo(() => {
    if (filePath && envs[FB_RAW_URL_MIRROR]) {
      return envs[FB_RAW_URL_MIRROR].replace('{orgName}', DEFAULT_ORG_NAME)
        .replace('{repoName}', 'files')
        .replace('{branchName}', 'main')
        .replace('{filePath}', filePath)
    }
    return null
  }, [envs, filePath])

  return useSWRImmutable<T>(url, proxy, options)
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
