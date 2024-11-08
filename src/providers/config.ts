import { create } from 'zustand'

const TRANSFORM_IN_GRAPHQL = 'config.transformInGraphql'

interface ConfigState {
  graphqlTransformEnabled: boolean
  toggleTransformInGraphql: (enabled: boolean) => void
}

export const useConfig = create<ConfigState>((set, get) => ({
  graphqlTransformEnabled: localStorage.getItem(TRANSFORM_IN_GRAPHQL) === '1',
  toggleTransformInGraphql: (enabled: boolean) => {
    localStorage.setItem(TRANSFORM_IN_GRAPHQL, enabled ? '1' : '0')
    set({ graphqlTransformEnabled: enabled })
  }
}))
