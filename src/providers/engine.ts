import { create } from 'zustand'

import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

export interface EngineState {
  errorInfo: { errTotal: number; warnTotal: number }
  engineStartTime: string
  engineStatus: ServiceStatus
  globalStartTime: string
  hookStatus: 'not_started' | 'running' | 'stopped'
  hookStartTime: string
  fbVersion: string
  fbCommit: string
  computed: {
    isCompiling: boolean
  }
  setEngineState: (state: Partial<EngineState>) => Promise<void>
}

export const useEngine = create<EngineState>((set, get) => ({
  errorInfo: { errTotal: 0, warnTotal: 0 },
  engineStatus: ServiceStatus.Started,
  hookStatus: 'not_started',
  hookStartTime: '',
  globalStartTime: '',
  engineStartTime: '',
  fbVersion: '--',
  fbCommit: '--',
  computed: {
    get isCompiling() {
      return [
        ServiceStatus.Starting,
        ServiceStatus.Building,
        ServiceStatus.EngineIncrementBuild,
        ServiceStatus.EngineIncrementStart
      ].includes(get().engineStatus)
    }
  },
  async setEngineState(state: Partial<EngineState>) {
    set(state)
  }
}))
