import '@/lib/socket'

import { Button, Form, Input, message } from 'antd'
import axios from 'axios'
import { isMatch, merge } from 'lodash'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { broadcast, useBroadcast } from '@/hooks/broadcast'
import { useAuthList } from '@/hooks/store/auth'
import { useDataSourceList } from '@/hooks/store/dataSource'
import { useStorageList } from '@/hooks/store/storage'
import type { AppRuntime } from '@/interfaces/base'
import type { FBVersion } from '@/lib/context/ConfigContext'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests, { setAuthKey, useAuthState } from '@/lib/fetchers'
import { useAppIntl } from '@/providers/IntlProvider'
import { setAuthKey as setAuthKey1 } from '@/services/a2s.adapter'
import type { ApiDocuments } from '@/services/a2s.namespace'

interface AuthenticationProps {
  children: ReactElement
}

const Authentication = (props: AuthenticationProps) => {
  const intl = useIntl()

  const { setLocale } = useAppIntl()
  const [authed, setAuthed] = useState(false)
  const authState = useAuthState()
  const [appRuntime, setAppRuntime] = useState<AppRuntime>()

  // 注册全局数据源，避免遗漏刷新
  useStorageList()
  useDataSourceList()
  useAuthList()

  useBroadcast('auth', 'setAuthKey', (key: string) => {
    setAuthKey(key)
    setAuthed(true)
  })
  useEffect(() => {
    if (!authState) {
      setAuthed(false)
    }
  }, [authState])
  const onSubmit = async ({ key }: { key: string }) => {
    setAuthKey(key)
    setAuthKey1(key)
    if (await refreshConfig()) {
      broadcast('auth', 'setAuthKey', key)
      setAuthed(true)
    } else {
      setAuthKey('')
      setAuthKey1('')
      setAuthed(false)
    }
  }
  // const [system, setSystem] = useState<SystemConfigType>()
  // const [environment, setEnvironment] = useState()
  // const [version, setVersion] = useState()
  const [globalSetting, setGlobalSetting] = useState<ApiDocuments.GlobalSetting & FBVersion>()
  const updateGlobalSetting = useCallback(
    async (settings: Partial<ApiDocuments.GlobalSetting>): Promise<boolean> => {
      if (!isMatch(globalSetting!, settings)) {
        await requests.put(`/globalSetting`, settings)
        await refreshConfig()
        return true
      } else {
        message.warning(intl.formatMessage({ defaultMessage: '配置未变更' }))
        return false
      }
    },
    [globalSetting, intl]
  )
  useEffect(() => {
    axios.get<AppRuntime>('/fb_health', { baseURL: '/' }).then(res => {
      if (res.status < 300) {
        setAppRuntime(res.data)
        refreshConfig().then(resp => {
          if (resp) {
            setAuthed(true)
            if (resp.allowedReport) {
              var hm = document.createElement('script')
              hm.id = 'usage-report'
              hm.src = 'https://hm.baidu.com/hm.js?a928cb21c5712bcb8257ea65acee4a98'
              var s = document.getElementsByTagName('script')[0]
              s.parentNode!.insertBefore(hm, s)
            } else {
              document.querySelector('#usage-report')?.remove()
            }
            if (resp.appearance?.language) {
              setLocale(resp.appearance.language.replace(/_/g, '-'))
            }
          }
        })
      }
    })
  }, [setLocale])

  const setVersion = (version: FBVersion) => {
    setGlobalSetting(merge(globalSetting, version))
  }

  const refreshConfig = async () => {
    try {
      const resp = await requests.get<any, ApiDocuments.GlobalSetting>('/globalSetting/single')
      const { fbVersion, fbCommit } = resp
      setGlobalSetting({ ...resp, fbVersion: fbVersion ?? '', fbCommit: fbCommit ?? '' })
      return resp
    } catch (e) {
      //
    }
  }

  if (appRuntime && appRuntime['enable-auth'] === true && !authed) {
    return (
      <div className="flex flex-col h-screen bg-warm-gray-200 w-screen items-center justify-center">
        <div>
          <Form className="flex w-200 items-center" layout="inline" onFinish={onSubmit}>
            <Form.Item
              name="key"
              className="!flex-1"
              rules={[
                { required: true, message: intl.formatMessage({ defaultMessage: '请输入密钥' }) }
              ]}
            >
              <Input
                className="flex-1"
                placeholder={intl.formatMessage({ defaultMessage: '请输入密钥' })}
                required
                size="large"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="ml-2" size="large" type="primary">
                <FormattedMessage defaultMessage="提交" />
              </Button>
            </Form.Item>
          </Form>
          <p className="mt-2 text-dark-400">
            <FormattedMessage defaultMessage="密钥可以在 Fireboom 启动日志中查找关键词"></FormattedMessage>
            <code className="rounded-sm bg-gray-500 text-white ml-1 py-0.5 px-1">
              Fireboom production key is
            </code>
          </p>
        </div>
      </div>
    )
  }
  if (!appRuntime || !globalSetting) {
    return <p>Loading</p>
  }
  return (
    <ConfigContext.Provider
      value={{ appRuntime, globalSetting, updateGlobalSetting, setVersion, refreshConfig }}
    >
      {props.children}
    </ConfigContext.Provider>
  )
}

export default Authentication
