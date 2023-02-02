import create from 'zustand'

type Log = {
  level: string
  logType: string
  msg: string
  time: string
}
export enum QuestionType {
  DatasourceQuestion = 1,
  OperationQuestion = 2,
  HooksQuestion = 3,
  AuthQuestion = 4,
  OssQuestion = 5,
  OauthQuestion = 6,
  InternalQuestion = 7
}
export type Question = {
  id: number
  sourceType: string
  dbType: string
  name: string
  icon: string
  msg: string
  switch: boolean
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
