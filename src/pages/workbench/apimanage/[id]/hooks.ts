import { createContext, useContext } from 'react'

interface APIState {
  apiDesc: any
}

export const APIContext = createContext<APIState>({ apiDesc: null })

export function useAPIDesc() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useContext<APIState>(APIContext)
}