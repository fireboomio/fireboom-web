import type { AuthAction } from '@/interfaces/auth'
import type { ApiDocuments } from '@/services/a2s.namespace'

export default function AuthReducer(authList: ApiDocuments.Authentication[], action: AuthAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return authList
    }
    case 'added': {
      return [...authList, action.data]
    }
    case 'changed':
      return authList.map(b => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return authList.filter(b => b.id !== action.data.id)
    }
    default:
      return authList
  }
}
