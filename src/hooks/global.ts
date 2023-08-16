import create from 'zustand'

type Log = {
  level: string
  msg: string
  time: string
}
export enum QuestionType {
  DatasourceQuestion = 'datasource',
  OperationQuestion = 'operation',
  HooksQuestion = 3,
  AuthQuestion = 4,
  OssQuestion = 'storage',
  OauthQuestion = 6,
  InternalQuestion = 7,
  SDK = 'sdk'
}
export type Question = {
  id: number
  sourceType: string
  dbType: string
  name: string
  icon: string
  msg: string
  enabled: boolean
  model: QuestionType
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
