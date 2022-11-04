import axios from 'axios'

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
export default async function getDefaultCode(name: string, hookName = ''): Promise<string> {
  return await axios
    .get<unknown, { data: string }>(hookTemplate[name], { responseType: 'text' })
    .then(res => {
      return res.data
    })
    .catch(err => {
      console.log('err', err)
      return ''
    })
}
