import { Row } from 'antd'
import Head from 'next/head'
import { useImmer } from 'use-immer'

import { AuthPannel } from '@/components/auth'
import AuthUser from '@/components/auth/subs/User'
import { AuthListType, AuthProvResp, MenuType } from '@/interfaces/auth'

import styles from './index.module.scss'

export default function UserManage() {
  const [_showBottomType, setShowBottomType] = useImmer('data')
  const [_showTopType, setShowTopType] = useImmer<MenuType>('userManage')

  const onClickItem = (authItem: AuthProvResp) => {
    if (authItem.name == '') {
      setShowBottomType('edit')
    } else {
      setShowBottomType('data')
    }
  }

  const handleTopToggleDesigner = (authType: AuthListType) => {
    setShowTopType(authType.type)
  }

  return (
    <>
      <Head>
        <title>FireBoom - 认证鉴权</title>
      </Head>

      <Row className="h-[calc(100vh_-_36px)]">
        <div className={`flex-1 ${styles['col-left']}`}>
          <AuthPannel onClickItem={onClickItem} handleTopToggleDesigner={handleTopToggleDesigner} />
        </div>

        <div className={styles.divider} />

        <div className="flex-1">
          <AuthUser handleTopToggleDesigner={handleTopToggleDesigner} />
        </div>
      </Row>
    </>
  )
}
