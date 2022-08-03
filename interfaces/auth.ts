export interface AuthProvResp {
  id: number
  name: string
  authSupplier: string
  switchState: Array<string>
  config: string
}

export type AuthAction = AuthsingleAction | AuthListAction

interface AuthsingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: AuthProvResp
}

interface AuthListAction {
  type: 'fetched'
  data: AuthProvResp[]
}

export interface AuthListType {
  name: string
  type: 'outline' | 'userManage' | 'roleManage' | 'action' | 'login' | 'connect' | 'webhooks'
}
