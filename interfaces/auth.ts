export interface AuthProvResp {
  id: number
  name: string
  source_type: number
  switch: number
  config: {
    [key: string]: number | string | boolean
  }
}

export interface AuthProvRequest {
  id: number
  name: string
  source_type: number
  switch: number
  config: string
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
