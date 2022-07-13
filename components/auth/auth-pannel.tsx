import { Button } from 'antd'
import { useContext } from 'react'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context'

import styles from './auth-pannel.module.scss'
import AuthList from './subs/auth-list'

interface Props {
  onClickItem: (fsItem: AuthProvResp) => void
}

export default function AuthPannel({ onClickItem }: Props) {
  const { handleToggleDesigner } = useContext(AuthToggleContext)

  return (
    <div className="relative h-200">
      <div className="border-gray border-b ">
        <div className={`${styles.title} text-lg font-bold mt-6 ml-4 mb-8`}>身份验证</div>
      </div>

      <AuthList onClickItem={onClickItem} />
      <div className="absolute inset-x-18 bottom-20">
        <Button
          className={`${styles['identify-button']}`}
          onClick={() => {
            handleToggleDesigner('identity')
          }}
        >
          <div className="mr-28 -mt-5">身份鉴权</div>
          <div className={`${styles['identify-info']}`}>身份鉴权一些描述</div>
          <div className={`${styles['identify-img']}`}> </div>
        </Button>
        <Button
          className={`${styles['role-button']} p-0 `}
          onClick={() => {
            handleToggleDesigner('role')
          }}
        >
          <div className="mr-28 -mt-5">角色配置</div>
          <div className="text-gray-500/50 text-sm w-5 ml-4">角色配置一些描述</div>
          <div className={`${styles['role-img']}`}> </div>
        </Button>
      </div>
    </div>
  )
}
