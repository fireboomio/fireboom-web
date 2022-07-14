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

export interface RoleProvResp {
  id: number
  code: string
  remark: string
  time?: string
}

export interface RoleProvRequest {
  code: string
  result: RoleProvResp
}
export type AuthAction = AuthsingleAction | AuthListAction

interface AuthsingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: AuthProvResp | AuthProvRequest
}

interface AuthListAction {
  type: 'fetched'
  data: AuthProvResp[]
}
