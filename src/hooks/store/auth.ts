import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

export interface AuthProvResp {
  point: string
  id: number
  name: string
  authSupplier: string
  switchState: string[]
  config: Record<string, string | number | boolean>
}

export function useAuthList(fetch = true) {
  return useSWRImmutable<AuthProvResp[]>(fetch ? '/auth' : null, url =>
    requests.get<unknown, any>(url)
  )
}
