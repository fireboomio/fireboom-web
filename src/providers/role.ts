import create from 'zustand'

import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

interface RoleState {
  roles: ApiDocuments.Role[]
  initialize: () => Promise<void>
  addRole(role: ApiDocuments.Role): Promise<void>
  updateRole(role: ApiDocuments.Role): Promise<void>
  deleteRole(key: string): Promise<void>
}

export const useRole = create<RoleState>((set, get) => ({
  roles: [],
  async initialize() {
    const res = await requests.get<any, ApiDocuments.Role[]>('/role')
    if (res) {
      set({ roles: res })
    }
  },
  async addRole(role: ApiDocuments.Role) {
    await requests.post('/role', role)
    await get().initialize()
  },
  async updateRole(role: ApiDocuments.Role) {
    await requests.put('/role', role)
    await get().initialize()
  },
  async deleteRole(key: string) {
    await requests.delete(`/role/${key}`)
    await get().initialize()
  }
}))
