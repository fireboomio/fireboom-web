export interface AuthProvItem {
  id: number
  name: string
  info: {
    [key: string]: number | string | boolean
  }
}

export type AuthAction = AuthsingleAction | AuthListAction

interface AuthsingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: AuthProvItem
}

interface AuthListAction {
  type: 'fetched'
  data: AuthProvItem[]
}
