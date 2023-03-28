import { uniqBy } from 'lodash'
import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'

const staticInject = {
  auth: ['mutatingPostAuthentication', 'postAuthentication', 'postLogout', 'revalidate'],
  global: ['onRequest', 'onResponse', 'onConnectionInit']
}

type StaticInjectKeys = keyof typeof staticInject

export function useHookModel(fetch = true) {
  const data = useSWRImmutable<any[]>(fetch ? '/hook/model' : null, requests.get, {
    revalidateOnMount: true
  }).data
  if (data) {
    Object.keys(staticInject).forEach(key => {
      const target = data.find(x => x.name === key)
      if (target?.children) {
        staticInject[key as StaticInjectKeys].forEach(hook => {
          target.children.push({
            name: hook,
            path: `${key}/${hook}`
          })
        })
        target.children = uniqBy(target.children, 'name')
      }
    })
  }
  return data
}

export function mutateHookModel() {
  return mutate('/hook/model')
}
