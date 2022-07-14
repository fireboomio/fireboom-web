import type { AuthProvResp, AuthAction } from '@/interfaces/auth'

export default function AuthReducer(authProvList: AuthProvResp[], action: AuthAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return authProvList
    }
    case 'added': {
      return [...authProvList, action.data]
    }
    case 'changed':
      return authProvList.map((b) => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return authProvList.filter((b) => b.id !== action.data.id)
    }
    default:
      return fileList
  }
}
