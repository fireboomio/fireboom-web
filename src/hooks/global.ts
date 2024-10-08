import { EngineStatus } from '@/interfaces/common'
import { create } from 'zustand'

type Log = {
  level: string
  msg: string
  time: string
}
export enum QuestionType {
  Authentication = 'authentication',
  Configuration = 'config',
  DataSource = 'datasource',
  Operation = 'operation',
  Role = 'role',
  Storage = 'storage',
  SDK = 'sdk'
}
export type Question = {
  // id: number
  // sourceType: string
  // dbType: string
  name: string
  // icon: string
  msg: string
  enabled: boolean
  model: QuestionType
  level: 'warn' | 'error'
  extra?: {
    enabled?: boolean
    engine?: 0 | 1 | 2
  }
}

export interface State {
  logs: Log[]
  setLogs: (logs: Log[]) => void
  questions: Question[]
  setQuestions: (questions: Question[]) => void
}

export const useGlobal = create<State>((set, get) => ({
  logs: [],
  setLogs: (logs: Log[]) => set({ logs }),
  questions: [],
  setQuestions: (questions: Question[]) => set({ questions })
}))
