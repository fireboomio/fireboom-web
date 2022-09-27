export interface AuthProvResp {
  id: number
  name: string
  authSupplier: string
  switchState: string[]
  config: Record<string, string | number | boolean>
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

export type MenuType =
  | 'title'
  | 'outline'
  | 'userManage'
  | 'userDetails'
  | 'roleManage'
  | 'log'
  | 'login'
  | 'connect'
  | 'connectDetails'
  | 'webhooks'
  | 'db'

export interface AuthListType {
  name: string
  type: MenuType
}

// 身份验证
export interface HookResp {
  content: string
  fileName: string
  hookName: string
  hookSwitch: boolean
}

export type HookName = 'postAuthentication' | 'mutatingPostAuthenti'

type UNLOCK = true
type LOCK = false

export interface User {
  id: string
  email: string
  encryptionPassword: string
  metaData: Record<string, string | number | boolean>
  mobile: string
  name: string
  nickName: string
  status: UNLOCK | LOCK
  lastLoginTime: string
  createTime: string
  updateTime: string
  userName: string
}

export interface OAuthResp {
  currPage: number
  pageSize: number
  totalPage: number
  userList: User[]
}
