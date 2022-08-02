export interface AuthProvResp {
  id: number
  name: string
  auth_supplier: string
  switch_state: Array<string>
  config: string
}

export interface AuthProvRequest {
  name: string
  auth_supplier: string
  switch_state: Array<string>
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
  type: 'userManage' | 'roleManage' | 'action' | 'login' | 'connect' | 'webhooks'
}
