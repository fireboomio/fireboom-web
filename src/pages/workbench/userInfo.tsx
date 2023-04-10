import { loader } from '@monaco-editor/react'
import { Button, message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ReactJson from 'react-json-view'

import { getHeader } from '@/lib/fetchers'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export default function UserInfo() {
  const [info, setInfo] = useState()
  const intl = useIntl()

  useEffect(() => {
    axios.get('/api/v1/oidc/userInfo').then(info => {
      setInfo(info.data)
    })
  }, [])

  const handleLogout = () => {
    axios
      .get('/auth/cookie/user/logout', {
        headers: getHeader(),
        params: { logout_openid_connect_provider: 'true' }
      })
      .then(res => {
        message.info(intl.formatMessage({ defaultMessage: '登出成功，即将关闭当前页面' }))
        const url = res.data?.redirect
        if (url) {
          axios.get(url)
        }
        setTimeout(() => {
          window.close()
        }, 3000)
      })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white flex flex-0 font-500 px-4 text-18px leading-40px items-center">
        <FormattedMessage defaultMessage="登录用户" />
        <Button className="ml-auto" onClick={handleLogout}>
          <FormattedMessage defaultMessage="登出" />
        </Button>
      </div>
      <div className="h-full flex-1 p-4 overflow-auto">
        {info ? <ReactJson src={info} iconStyle="triangle" name={false} /> : null}
      </div>
    </div>
  )
}
