import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

export default function useEnvOptions() {
  const { data: envOptions } = useSWRImmutable<
    {
      label: string
      value: string
    }[]
  >('/env', url =>
    requests
      .get<unknown, Array<{ deleteTime: string; key: string }>>(url)
      .then(envs => envs.filter(x => !x.deleteTime).map(x => ({ label: x.key, value: x.key })))
  )
  return envOptions
}
