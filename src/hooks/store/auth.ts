import { mutate } from 'swr'
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

export function useAuthList() {
  return useSWRImmutable<AuthProvResp[]>('/auth', requests.get).data
}

export function mutateAuth() {
  return mutate('/auth')
}
