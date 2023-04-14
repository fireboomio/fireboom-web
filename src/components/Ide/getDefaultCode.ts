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

let tsPromise: Promise<any>

export async function getTsTemplate(name: string): Promise<string> {
  if (!tsPromise) {
    tsPromise = proxy(
      'https://raw.githubusercontent.com/fireboomio/files/main/hook.templates.ts.json'
    )
  }
  const data = await tsPromise
  return get(data, name, '')
}

let goPromise: Promise<any>

export async function getGoTemplate(name: string): Promise<string> {
  if (!goPromise) {
    goPromise = proxy(
      'https://raw.githubusercontent.com/fireboomio/files/main/hook.templates.go.json'
    )
  }
  const data = await goPromise
  return get(data, name, '')
}
