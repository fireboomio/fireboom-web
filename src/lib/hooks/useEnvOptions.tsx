import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'
import { useEnv } from '@/providers/env'
import type { ApiDocuments } from '@/services/a2s.namespace'

// FIXME 经常刷新
export default function useEnvOptions() {
  const { envs } = useEnv()
  const { data } = useSWRImmutable<ApiDocuments.Env>('/env/single', requests.get)
  return Object.keys(data ?? {}).map(k => ({
    label: (
      <div className="flex items-center justify-between w-full">
        <span>{k}</span>
        <span className="text-[#999] pl-1">{envs[k]}</span>
      </div>
    ),
    value: k
  }))
}
