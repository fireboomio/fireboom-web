import { useEffect } from 'react'

import type { AuthListType, AuthProvResp } from '@/interfaces/auth'

import styles from './Pannel.module.scss'
import AuthList from './subs/List'

interface Props {
  onClickItem: (authItem: AuthProvResp) => void
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const initSettingPage: AuthListType = {
  name: '用户管理',
  type: 'userManage',
}

export default function AuthPannel({ onClickItem, handleTopToggleDesigner }: Props) {
  useEffect(() => {
    handleTopToggleDesigner(initSettingPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="relative h-200">
      <div className="border-gray border-b ">
        <div className={`${styles.title} text-lg font-bold mt-6 ml-4 mb-8`}>身份验证</div>
      </div>
      <AuthList onClickItem={onClickItem} handleTopToggleDesigner={handleTopToggleDesigner} />
    </div>
  )
}
