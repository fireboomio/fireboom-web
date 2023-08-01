import '@/lib/socket'

import { Button, Form, Input } from 'antd'
import axios from 'axios'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { broadcast, useBroadcast } from '@/hooks/broadcast'
import { useAuthList } from '@/hooks/store/auth'
import { useDataSourceList } from '@/hooks/store/dataSource'
import { useStorageList } from '@/hooks/store/storage'
import type { AppRuntime } from '@/interfaces/base'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests, { hasAuthKey, setAuthKey, useAuthState } from '@/lib/fetchers'
import { services } from '@/services'
import { setAuthKey as setAuthKey1 } from '@/services/a2s.adapter'
import type { ApiDocuments } from '@/services/a2s.namespace'

interface AuthenticationProps {
  children: ReactElement
}

const Authentication = (props: AuthenticationProps) => {
  const intl = useIntl()
  const [authed, setAuthed] = useState(hasAuthKey())
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
    const resp = await requests.get('/')
    const success = resp.status < 300 && resp.status >= 200
    if (!success) {
      setAuthKey('')
      setAuthKey1('')
    } else {
      broadcast('auth', 'setAuthKey', key)
    }
    setAuthed(success)
  }
  // const [system, setSystem] = useState<SystemConfigType>()
  // const [environment, setEnvironment] = useState()
  // const [version, setVersion] = useState()
  const [globalSetting, setGlobalSetting] = useState<ApiDocuments.GlobalSetting>()
  useEffect(() => {
    axios.get<AppRuntime>('/health', { baseURL: '/' }).then(res => {
      if (res.status < 300) {
        setAppRuntime(res.data)
        refreshConfig()
      }
    })
  }, [])
  const refreshConfig = async () => {
    const { error, data } = await services['globalSetting@/globalSetting/single']()
    if (!error) {
      setGlobalSetting(data)
    }
    // void requests.get<unknown, any>('/setting/system').then(res => {
    //   setSystem(res.system)
    //   setVersion(res.version)
    //   setEnvironment(res.environment)
    //   try {
    //     // @ts-ignore
    //     window.__bl.setConfig({ disabled: !res.system.usageReport })
    //   } catch (_) {
    //     // ignore
    //   }
    // })
  }
  return appRuntime && globalSetting ? (
    <ConfigContext.Provider value={{ appRuntime, globalSetting, refreshConfig }}>
      {/* {authed || system.isDev ? ( */}
      {authed || !appRuntime['enable-auth'] ? (
        props.children
      ) : (
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
      )}
    </ConfigContext.Provider>
  ) : (
    <p>Loading</p>
  )
}

export default Authentication
