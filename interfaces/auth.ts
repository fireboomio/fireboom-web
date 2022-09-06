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
  type:
    | 'outline'
    | 'userManage'
    | 'userDetails'
    | 'roleManage'
    | 'action'
    | 'login'
    | 'connect'
    | 'connectDetails'
    | 'webhooks'
    | 'db'
}

// 身份验证
export interface HookResp {
  content: string
  fileName: string
  hookName: string
  hookSwitch: boolean
}

export type HookName = 'postAuthentication' | 'mutatingPostAuthenti'
