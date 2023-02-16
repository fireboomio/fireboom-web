import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

export function useHookModel(fetch = true) {
  return useSWRImmutable<any[]>(fetch ? '/hook/model' : null, requests.get, {
    revalidateOnMount: true
  }).data
}

export function mutateHookModel() {
  return mutate('/hook/model')
}
