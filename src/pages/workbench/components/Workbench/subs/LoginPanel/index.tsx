import axios from 'axios'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'

import JsonViewer from '@/components/JsonViewer'
import { mutateAuth, useAuthList } from '@/hooks/store/auth'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { useAuthTest } from '@/utils/auth'

import fireBg from './assets/fire.svg'
import logoutIcon from './assets/logout.svg'
import styles from './index.module.less'

export default function LoginPanel() {
  const intl = useIntl()
  const { globalSetting } = useContext(ConfigContext)
  const { logout } = useContext(WorkbenchContext)

  const { doTest } = useAuthTest('#/workbench/rapi/loginBack', { closeWindow: false })
  const { getConfigurationValue } = useConfigurationVariable()
  const { data: userInfo, trigger } = useSWRMutation<any>(
    `${getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl)}/auth/cookie/user`,
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
    logout(getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl)!).then(async res => {
      location.reload()
    })
  }
  const toggleLogin = async (auth: ApiDocuments.Authentication) => {
    await doTest(auth.name)
  }
  const authList = useAuthList() ?? []
  const filterAuthList = authList?.filter(x => x.name !== userInfo?.providerId)
  return (
    <div className={styles.entry}>
      <img
        src={`${import.meta.env.BASE_URL}assets/icon/oidc.svg`}
        className="h-3 mr-2 w-3"
        alt=""
      />
      <span>
        {userInfo ? userInfo.providerId : intl.formatMessage({ defaultMessage: '未登录' })}
      </span>
      <div className={styles.panel}>
        {userInfo ? (
          <div className={styles.userInfo}>
            <img src={fireBg} alt="" className={styles.fireBg} />
            <div className={styles.head}>
              <img
                src={`${import.meta.env.BASE_URL}assets/icon/oidc.svg`}
                className="h-6 mr-2 w-6"
                alt=""
              />
              {userInfo.providerId}
            </div>
            <div className={styles.content}>
              <JsonViewer data={userInfo} />
            </div>
          </div>
        ) : null}

        {filterAuthList.length > 0 && (
          <div className={styles.switchLine}>
            {intl.formatMessage({ defaultMessage: '切换项目' })}
          </div>
        )}
        {filterAuthList.map(auth => (
          <div className={styles.itemLine} key={auth.name} onClick={() => toggleLogin(auth)}>
            <img
              src={`${import.meta.env.BASE_URL}assets/icon/oidc.svg`}
              className="h-4 mr-2.5 w-4"
              alt=""
            />
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
