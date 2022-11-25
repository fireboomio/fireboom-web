import useSWRImmutable from 'swr/immutable'

import type { Experience } from '@/interfaces/experience'
import requests, { getFetcher } from '@/lib/fetchers'

export const useFetchExperience = () => {
  return useSWRImmutable<Experience, Error>('/auth/loginConfig', getFetcher)
}

export const upsertExperience = (data: unknown) => {
  return requests.post('/auth/loginConfig', data)
}
