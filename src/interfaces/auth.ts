import type { ApiDocuments } from '@/services/a2s.namespace'

export type AuthAction = AuthsingleAction | AuthListAction

interface AuthsingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: ApiDocuments.Authentication
}

interface AuthListAction {
  type: 'fetched'
  data: ApiDocuments.Authentication[]
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
  enabled: boolean
}

export type HookName = 'postAuthentication' | 'mutatingPostAuthenti'

type UNLOCK = 1
type LOCK = 0

export interface User {
  id: string
  email: string
  encryptionPassword: string
  metaData: Record<string, string | number | boolean>
  mobile: string
  name: string
  postalCode: string
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
  totalSize: number
  userList: User[]
}
