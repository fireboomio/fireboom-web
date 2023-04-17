import { message } from 'antd'
import axios from 'axios'
import { useContext, useEffect } from 'react'
import ReactJson from 'react-json-view'
import { useLocation } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'

import { mutateAuth, useAuthList } from '@/hooks/store/auth'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { intl } from '@/providers/IntlProvider'

import fireBg from './assets/fire.svg'
import logoutIcon from './assets/logout.svg'
import styles from './index.module.less'

export default function LoginPanel() {
  const { system } = useContext(ConfigContext)
  const { logout } = useContext(WorkbenchContext)
  const { data: userInfo, trigger } = useSWRMutation<any>(
    `${system.apiPublicAddr}/auth/cookie/user`,
    (key: string) => {
      return axios.get(key, { withCredentials: true }).then(res => res.data)
    }
  )
  const { search } = useLocation()
  useEffect(() => {
    trigger()
    mutateAuth()
  }, [search, trigger])
  const doLogout = () => {
    logout(system.apiPublicAddr).then(async res => {
      location.reload()
    })
  }
  const doLogin = (auth: any) => {
    // 生成回调地址，此处假设使用hash路由，如果更改路由方式需要调整
    const callbackURL = new URL(location.toString())
    callbackURL.hash = '#/workbench/rapi/loginBack'
    let target
    try {
      target = new URL(auth?.point + encodeURIComponent(callbackURL.toString()))
    } catch (e) {
      message.error(
        intl.formatMessage({ defaultMessage: '地址异常，请检查系统设置中的API域名是否正确' })
      )
      console.error(e)
      return
    }
    window.open(target.toString())
  }
  const authList = useAuthList() ?? []
  const filterAuthList = authList?.filter(x => x.name !== userInfo?.providerId)
  return (
    <div className={styles.entry}>
      <img src="/assets/icon/oidc.svg" className="h-3 mr-2 w-3" alt="" />
      <span>
        {userInfo ? userInfo.providerId : intl.formatMessage({ defaultMessage: '未登录' })}
      </span>
      <div className={styles.panel}>
        {userInfo ? (
          <div className={styles.userInfo}>
            <img src={fireBg} alt="" className={styles.fireBg} />
            <div className={styles.head}>
              <img src="/assets/icon/oidc.svg" className="h-6 mr-2 w-6" alt="" />
              {userInfo.providerId}
            </div>
            <div className={styles.content}>
              <ReactJson
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                src={userInfo}
                iconStyle="triangle"
                name={false}
                style={{
                  wordBreak: 'break-word'
                }}
              />
            </div>
          </div>
        ) : null}

        {filterAuthList.length > 0 && (
          <div className={styles.switchLine}>
            {intl.formatMessage({ defaultMessage: '切换项目' })}
          </div>
        )}
        {filterAuthList.map(auth => (
          <div className={styles.itemLine} key={auth.name} onClick={() => doLogin(auth)}>
            <img src="/assets/icon/oidc.svg" className="h-4 mr-2.5 w-4" alt="" />
            {auth.name}
          </div>
        ))}
        {userInfo?.userId ? (
          <div className={styles.logoutLine} onClick={doLogout}>
            <img src={logoutIcon} className="h-4 mr-2.5 w-4" alt="" />
            {intl.formatMessage({ defaultMessage: '退出项目' })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
