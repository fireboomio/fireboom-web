import { create } from 'zustand'

import requests from '@/lib/fetchers'

export type EnvData = { key: string; value: string }

interface EnvState {
  envs: Record<string, string>
  computed: {
    asArray: EnvData[]
  }
  initialize: () => Promise<void>
  updateEnv(env: EnvData): Promise<void>
  deleteEnv(key: string): Promise<void>
}

export const useEnv = create<EnvState>((set, get) => ({
  envs: {},
  computed: {
    get asArray() {
      return Object.keys(get().envs ?? {}).map<EnvData>(key => ({ key, value: get().envs[key] }))
    }
  },
  async initialize() {
    const res = await requests.get<any, Record<string, string>>('/env/single')
    if (res) {
      set({ envs: res })
    }
  },
  async updateEnv(env: EnvData) {
    await requests.put('/env', {
      [env.key]: env.value
    })
    await get().initialize()
  },
  async deleteEnv(key: string) {
    await requests.put('/env', {
      [key]: null
    })
    await get().initialize()
  }
}))
