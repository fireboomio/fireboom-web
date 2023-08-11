import { message } from 'antd'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { ConfigContext } from '@/lib/context/ConfigContext'
import type { WorkbenchContextType } from '@/lib/context/workbenchContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { useConfigurationVariable } from '@/providers/variable'

export function useAuthTest(
  callbackUrl: string,
  logoutOpt?: Parameters<WorkbenchContextType['logout']>[1]
) {
  const intl = useIntl()
  const { globalSetting } = useContext(ConfigContext)
  const { logout } = useContext(WorkbenchContext)
  const { getConfigurationValue } = useConfigurationVariable()
  const apiPublicUrl = getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl) ?? ''

  return {
    async doTest(authName: string) {
      try {
        await logout(apiPublicUrl, logoutOpt)
      } catch (e) {
        //
      }
      // 生成回调地址，此处假设使用hash路由，如果更改路由方式需要调整
      const callbackURL = new URL(location.toString())
      callbackURL.hash = callbackUrl
      let target
      try {
        target = new URL(
          `${apiPublicUrl}/auth/cookie/authorize/${authName}?redirect_uri=${encodeURIComponent(
            callbackURL.toString()
          )}`
        )
      } catch (e) {
        message.error(
          intl.formatMessage({ defaultMessage: '地址异常，请检查系统设置中的API域名是否正确' })
        )
        console.error(e)
        return
      }
      window.open(target.toString())
    }
  }
}
