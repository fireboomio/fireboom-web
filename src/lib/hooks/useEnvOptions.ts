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
      .get<unknown, Array<{ isDel: number; key: string }>>(url)
      .then(envs => envs.filter(x => x.isDel === 0).map(x => ({ label: x.key, value: x.key })))
  )
  return envOptions
}
