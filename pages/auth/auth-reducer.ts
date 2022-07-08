import type { AuthProvItem, AuthAction } from '@/interfaces/auth'

export default function AuthProvReducer(fileList: AuthProvItem[], action: AuthAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return fileList
    }
    case 'added': {
      return [...fileList, action.data]
    }
    case 'changed':
      return fileList.map((b) => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return fileList.filter((b) => b.id !== action.data.id)
    }
    default: {
      throw Error('Unknown action')
    }
  }
}
