import type { AuthProvResp, AuthAction } from '@/interfaces/auth'

export default function AuthReducer(authList: AuthProvResp[], action: AuthAction) {
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
      return authList.map((b) => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return authList.filter((b) => b.id !== action.data.id)
    }
    default:
      return authList
  }
}
