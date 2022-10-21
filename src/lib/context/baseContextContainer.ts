import type { Dispatch } from 'react'

import type { AnyAction } from '@/lib/actions/ActionTypes'

export type BasicContextContainer = {
  dispatch: Dispatch<AnyAction>
}
