export interface AuthProvResp {
  id: number
  name: string
  auth_supplier: number
  switch_state: number
  config: string
}

export interface AuthProvRequest {
  name: string
  auth_supplier: number
  switch_state: number
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
