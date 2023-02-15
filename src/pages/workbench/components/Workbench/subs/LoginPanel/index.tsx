import axios from 'axios'
import useSWR from 'swr'

import { intl } from '@/providers/IntlProvider'

import styles from './index.module.less'

export default function LoginPanel() {
  const { userInfo, mutate } = useSWR<any>('/api/v1/oidc/userInfo', key =>
    axios.get(key).then(res => res.data)
  )
  return (
    <div className={styles.entry}>
      <img src="/assets/icon/oidc.svg" className="h-14px mr-1.5 w-14px" alt="文件" />
      <span>
        {userInfo ? userInfo.providerId : intl.formatMessage({ defaultMessage: '未登录' })}
      </span>
    </div>
  )
}
