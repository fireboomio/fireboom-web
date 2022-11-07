import axios from 'axios'
import { get } from 'lodash'

const hookTemplate: Record<string, string> = {
  // 全局hook
  onRequest: '/assets/hooks/onRequest.ts',
  onResponse: '/assets/hooks/onResponse.ts',

  // 鉴权hook
  postAuthentication: '/assets/hooks/postAuthentication.ts',
  revalidate: '/assets/hooks/revalidate.ts',
  mutatingPostAuthentication: '/assets/hooks/mutatingPostAuthentication.ts',
  // apiHook
  customResolve: '/assets/hooks/customResolve.ts',
  mockResolve: '/assets/hooks/mockResolve.ts',
  mutatingPreResolve: '/assets/hooks/mutatingPreResolve.ts',
  postResolve: '/assets/hooks/postResolve.ts',
  preResolve: '/assets/hooks/preResolve.ts'
}
let hookPromise: Promise<any>

export default async function getDefaultCode(name: string, hookName = ''): Promise<string> {
  if (!hookPromise) {
    hookPromise = axios
      .get('/assets/hooks/hookTmpl.json')
      .then(res => {
        return res.data
      })
      .catch(err => {
        console.log('err', err)
        return ''
      })
  }
  const data = await hookPromise
  console.log(data, 'data')
  return get(data, name, '')
}
