import { loader } from '@monaco-editor/react'
import { Button } from 'antd'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ReactJson from 'react-json-view'

import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { useConfigurationVariable } from '@/providers/variable'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export default function UserInfo() {
  const [info, setInfo] = useState()
  const { globalSetting } = useContext(ConfigContext)
  const { logout } = useContext(WorkbenchContext)
  const { getConfigurationValue } = useConfigurationVariable()

  useEffect(() => {
    axios
      .get(`${getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl)}/auth/cookie/user`, {
        withCredentials: true
      })
      .then(info => {
        setInfo(info.data)
      })
  }, [getConfigurationValue, globalSetting.nodeOptions])

  const handleLogout = () => {
    logout(getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl)!).then(() => {
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
        {info ? (
          <ReactJson
            src={info}
            iconStyle="triangle"
            name={false}
            style={{
              wordBreak: 'break-word'
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
