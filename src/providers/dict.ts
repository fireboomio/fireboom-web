import create from 'zustand'

import requests from '@/lib/fetchers'

interface DictState {
  authentication: string
  datasource: string
  operation: string
  sdk: string
  upload: string
  beforeOriginRequest: string
  customResolve: string
  customize: string
  defaultMiddleware: string
  env: string
  globalOperation: string
  globalSetting: string
  mockResolve: string
  mutatingPostAuthentication: string
  mutatingPostResolve: string
  mutatingPreResolve: string
  onConnectionInit: string
  onOriginRequest: string
  onOriginResponse: string
  operationsConfig: string
  postAuthentication: string
  postLogout: string
  postResolve: string
  postUpload: string
  preResolve: string
  preUpload: string
  revalidateAuthentication: string
  role: string
  storage: string
  wunderGraphConfiguration: string
  initialize: () => Promise<void>
}

export const useDict = create<DictState>((set, get) => ({
  authentication: '',
  datasource: '',
  operation: '',
  sdk: '',
  upload: '',
  beforeOriginRequest: '',
  customResolve: '',
  customize: '',
  defaultMiddleware: '',
  env: '',
  globalOperation: '',
  globalSetting: '',
  mockResolve: '',
  mutatingPostAuthentication: '',
  mutatingPostResolve: '',
  mutatingPreResolve: '',
  onConnectionInit: '',
  onOriginRequest: '',
  onOriginResponse: '',
  operationsConfig: '',
  postAuthentication: '',
  postLogout: '',
  postResolve: '',
  postUpload: '',
  preResolve: '',
  preUpload: '',
  revalidateAuthentication: '',
  role: '',
  storage: '',
  wunderGraphConfiguration: '',
  async initialize() {
    const res = await requests.get<any, DictState>('/system/directories')
    if (res) {
      set({ ...res })
    }
  }
}))
