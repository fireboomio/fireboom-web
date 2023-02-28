import { get } from 'lodash'

import { proxy } from '@/lib/fetchers'

let hookPromise: Promise<any>

export async function getDefaultCode(name: string): Promise<string> {
  if (!hookPromise) {
    hookPromise = proxy('https://raw.githubusercontent.com/fireboomio/files/main/hookTmpl.json')
  }
  const data = await hookPromise
  return get(data, name, '')
}

export async function getExampleList(name: string): Promise<{ name: string; code: string }[]> {
  if (!hookPromise) {
    hookPromise = proxy('https://raw.githubusercontent.com/fireboomio/files/main/hookTmpl.json')
  }
  const data = await hookPromise
  return get(data, name, [])
}
