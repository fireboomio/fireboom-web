import create from 'zustand'

import requests from '@/lib/fetchers'

interface DictState {
  authentication: string
  beforeOriginRequest: string
  customResolve: string
  customize: string
  datasource: string
  defaultMiddleware: string
  env: string
  function: string
  globalOperation: string
  globalSetting: string
  graphql: string
  mockResolve: string
  mutatingPostAuthentication: string
  mutatingPostResolve: string
  mutatingPreResolve: string
  oas: string
  onConnectionInit: string
  onOriginRequest: string
  onOriginResponse: string
  operation: string
  operationsConfig: string
  postAuthentication: string
  postLogout: string
  postResolve: string
  postUpload: string
  preResolve: string
  preUpload: string
  prisma: string
  proxy: string
  revalidateAuthentication: string
  role: string
  sdk: string
  sqlite: string
  storage: string
  wunderGraphConfiguration: string
  initialize: () => Promise<void>
}

export const useDict = create<DictState>((set, get) => ({
  authentication: '',
  beforeOriginRequest: '',
  customResolve: '',
  customize: '',
  datasource: '',
  defaultMiddleware: '',
  env: '',
  function: '',
  globalOperation: '',
  globalSetting: '',
  graphql: '',
  mockResolve: '',
  mutatingPostAuthentication: '',
  mutatingPostResolve: '',
  mutatingPreResolve: '',
  oas: '',
  onConnectionInit: '',
  onOriginRequest: '',
  onOriginResponse: '',
  operation: '',
  operationsConfig: '',
  postAuthentication: '',
  postLogout: '',
  postResolve: '',
  postUpload: '',
  preResolve: '',
  preUpload: '',
  prisma: '',
  proxy: '',
  revalidateAuthentication: '',
  role: '',
  sdk: '',
  sqlite: '',
  storage: '',
  wunderGraphConfiguration: '',
  async initialize() {
    const res = await requests.get<any, DictState>('/system/directories')
    if (res) {
      set({ ...res })
    }
  }
}))
