import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

// FIXME 经常刷新
export default function useEnvOptions() {
  const { data } = useSWRImmutable<ApiDocuments.Env>('/env/single', requests.get)
  return Object.keys(data ?? {}).map(k => ({ label: k, value: k }))
}
