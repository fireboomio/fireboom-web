import create from 'zustand'

import requests from '@/lib/fetchers'

interface DictState {
  authentication: string
  datasource: string
  operation: string
  sdk: string
  upload: string
  initialize: () => Promise<void>
}

export const useDict = create<DictState>((set, get) => ({
  authentication: '',
  datasource: '',
  operation: '',
  sdk: '',
  upload: '',
  async initialize() {
    const res = await requests.get<any, DictState>('/system/directories')
    if (res) {
      set({ ...res })
    }
  }
}))
