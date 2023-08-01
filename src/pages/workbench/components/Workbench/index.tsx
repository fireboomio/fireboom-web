import { App, Layout as ALayout, message, Spin } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import type { PropsWithChildren } from 'react'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import { getGoTemplate, getTsTemplate } from '@/components/Ide/getDefaultCode'
import { useGlobal } from '@/hooks/global'
import { mutateApi } from '@/hooks/store/api'
import type { Info } from '@/interfaces/common'
import { GlobalContext } from '@/lib/context/globalContext'
import type {
  MenuName,
  RefreshMap,
  WorkbenchEvent,
  WorkbenchListener
} from '@/lib/context/workbenchContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import events, { useWebSocket } from '@/lib/event/events'
import requests, { getAuthKey, getHeader } from '@/lib/fetchers'
import { getHook, saveHookScript, updateHookEnabled } from '@/lib/service/hook'
import { initWebSocket, sendMessageToSocket } from '@/lib/socket'
import { HookStatus, ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { replaceFileTemplate } from '@/utils/template'

import styles from './index.module.less'
import Header from './subs/Header'
import Sider from './subs/Sider'
import StatusBar from './subs/StatusBar'

const ModelingWrapper = React.lazy(
  () => import('@/pages/workbench/modeling/components/modelingWrapper')
)

const Window = React.lazy(() => import('@/pages/workbench/components/Workbench/subs/Window'))
const { Header: AHeader, Footer: AFooter, Sider: ASider, Content: AContent } = ALayout

const MENU_WIDTH = 230

export default function Index(props: PropsWithChildren) {
  const intl = useIntl()
  const [info, setInfo] = useState<Info>({
    errorInfo: { errTotal: 0, warnTotal: 0 },
    engineStatus: ServiceStatus.NotStarted,
    hookStatus: HookStatus.Stopped,
    startTime: '',
    fbVersion: '--',
    fbCommit: '--'
  })
  const [showWindow, setShowWindow] = useState(false)
  const [defaultWindowTab, setDefaultWindowTab] = useState<string>()
  const [hideSider, setHideSider] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const [refreshState, setRefreshState] = useState(false)
  const listener = useRef<WorkbenchListener>()

  const [vscode, setVscode] = useState<{ visible: boolean; currentPath: string; config: any }>({
    visible: false,
    currentPath: '',
    config: {}
  })
  const [loading, setLoading] = useState('')

  // context
  const [editFlag, setEditFlag] = useState<boolean>(false)
  const [refreshMap, setRefreshMap] = useImmer<RefreshMap>({
    api: false,
    auth: false,
    dataSource: false,
    storage: false
  })
  const { setLogs, logs, setQuestions } = useGlobal(state => ({
    logs: state.logs,
    setLogs: state.setLogs,
    questions: state.questions,
    setQuestions: state.setQuestions
  }))

  const authKey = getAuthKey()
  // authkey变化时启动socket
  useEffect(() => {
    initWebSocket(authKey ?? '')
  }, [authKey])
  useWebSocket('engine', 'getStatus', data => {
    setInfo(data)
    if (data.engineStatus === ServiceStatus.Started) {
      void mutateApi()
      events.emit({ event: 'compileFinish' })
    }
  })
  useWebSocket('engine', 'pushStatus', data => {
    setInfo({ ...info, engineStatus: data.engineStatus, startTime: data.startTime })
    if (data.engineStatus === ServiceStatus.Started) {
      void mutateApi()
      events.emit({ event: 'compileFinish' })
    }
  })
  useWebSocket('engine', 'getHookStatus', data => {
    message.success(intl.formatMessage({ defaultMessage: '钩子状态已刷新' }))
    setInfo({ ...info, hookStatus: data.hookStatus })
  })
  useWebSocket('engine', 'pushHookStatus', data => {
    setInfo({ ...info, hookStatus: data.hookStatus })
  })
  useWebSocket('log', 'getLogs', data => {
    setLogs(parseLogs(data))
  })
  useWebSocket('log', 'appendLog', data => {
    setLogs(logs.concat(parseLogs(data)))
  })
  useWebSocket('question', 'getQuestions', data => {
    setQuestions(data?.questions || [])
  })
  useWebSocket('question', 'setQuestions', data => {
    setQuestions(data.questions)
  })
  useEffect(() => {
    sendMessageToSocket({ channel: 'engine', event: 'getStatus' })
    sendMessageToSocket({ channel: 'log', event: 'getLogs' })
    sendMessageToSocket({ channel: 'question', event: 'getQuestions' })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const headers = new Headers()
    headers.set('X-FB-Authentication', getAuthKey() ?? '')

    return () => {
      controller.abort()
    }
  }, [refreshState])

  const handleRefreshMenu = (listName: MenuName) => {
    setRefreshMap(refreshMap => {
      refreshMap[listName] = !refreshMap[listName]
    })
  }
  const markEdit = (flag: boolean) => {
    setEditFlag(flag)
  }
  const { modal } = App.useApp()
  const navCheck = useCallback(async () => {
    if (!editFlag) {
      return true
    }
    return await new Promise<boolean>(resolve => {
      modal.confirm({
        title: intl.formatMessage({
          defaultMessage: '即将离开当前页面，未保存的内容将被丢失，是否确认？'
        }),
        onOk: () => {
          setEditFlag(false)
          resolve(true)
        },
        onCancel: () => resolve(false)
      })
    })
  }, [editFlag, intl, modal])

  const logout = useCallback(
    (
      apiPublicAddr: string,
      opts?: {
        logoutProvider?: boolean
        closeWindow?: boolean
      }
    ) => {
      return axios
        .get(`${apiPublicAddr}/auth/cookie/user/logout`, {
          headers: getHeader(),
          params: { logout_openid_connect_provider: opts?.logoutProvider ?? true },
          withCredentials: true
        })
        .then(res => {
          const redirect = res.data?.redirect
          if (redirect) {
            const iframe = document.createElement('iframe')
            iframe.src = redirect
            document.body.appendChild(iframe)
            setTimeout(() => {
              document.body.removeChild(iframe)
            }, 5000)
          }
          if (opts?.closeWindow ?? true) {
            message.info(intl.formatMessage({ defaultMessage: '登出成功，即将关闭当前页面' }))
            setTimeout(() => {
              window.close()
            }, 3000)
          }
        })
    },
    [intl]
  )

  const body = (
    <ALayout className={`h-100vh ${styles.workbench}`}>
      {!fullScreen && (
        <AHeader className={styles.header}>
          <Header
            onToggleSider={() => setHideSider(!hideSider)}
            engineStatus={info?.engineStatus}
          />
        </AHeader>
      )}
      <ALayout>
        <ASider
          width={MENU_WIDTH}
          style={{ marginLeft: hideSider || fullScreen ? -1 * MENU_WIDTH : 0 }}
          theme="light"
          className={styles.sider}
        >
          <Sider />
        </ASider>
        <ALayout className="relative">
          <AContent className="bg-[#FBFBFB]">{props.children}</AContent>
          {showWindow ? (
            <Suspense>
              <Window
                style={{ left: 0, right: 0, bottom: 0 }}
                toggleWindow={() => setShowWindow(!showWindow)}
                defaultTab={defaultWindowTab}
              />
            </Suspense>
          ) : (
            <></>
          )}
        </ALayout>
      </ALayout>
      {!fullScreen && (
        <AFooter className={styles.footer}>
          <StatusBar
            version={info?.fbVersion}
            commit={info?.fbCommit}
            startTime={info?.startTime}
            engineStatus={info?.engineStatus}
            hookStatus={info?.hookStatus}
            menuWidth={fullScreen ? 0 : MENU_WIDTH}
            toggleWindow={(defaultTab: string) => {
              setDefaultWindowTab(defaultTab)
              setShowWindow(!showWindow)
            }}
          />
        </AFooter>
      )}
    </ALayout>
  )
  const location = useLocation()
  const navigate = useNavigate()
  const { data } = useSWRImmutable<{ language: string }>('/sdk/enabledServer', requests)
  const { data: sdk } = useSWR<ApiDocuments.Sdk[]>('/sdk', requests.get)
  const language = data?.language
  const checkHookExist = async (path: string, hasParam = false, skipConfirm = false) => {
    try {
      if (!language || !sdk?.find(item => item.type === 'server')) {
        navigate('/workbench/sdk-template')
        message.warning(intl.formatMessage({ defaultMessage: '请选择钩子模版' }))
        return false
      }

      const hook = await getHook(path)
      if (!hook?.script) {
        if (!skipConfirm) {
          const confirm = await new Promise(resolve => {
            modal.confirm({
              title: intl.formatMessage({ defaultMessage: '钩子脚本不存在，是否创建？' }),
              onOk: () => resolve(true),
              onCancel: () => resolve(false),
              zIndex: 99999
            })
          })
          if (!confirm || !language) {
            return false
          }
        }
        setLoading('钩子模板创建中，请稍候')
        const code = await resolveDefaultCode(path, hasParam, language)
        await saveHookScript(path, code)
        return true
      } else {
        return true
      }
    } catch (e) {
      setLoading('')
      console.error(e)
      return false
    } finally {
      setLoading('')
    }
  }
  const globalProviderValue = {
    vscode: {
      options: vscode,
      checkHookExist,
      toggleHook: async (flag: boolean, path: string, hasParam = false) => {
        // 打开钩子时，需要检查钩子文件
        if (flag && !(await checkHookExist(path, hasParam))) {
          return
        }
        await updateHookEnabled(path, flag)
      },
      hide: () => {
        setVscode({
          visible: false,
          currentPath: '',
          config: {}
        })
      },
      show: async (path?: string, config?: any) => {
        if (path && !(await checkHookExist(path ?? ''))) {
          return
        }
        setVscode({
          visible: true,
          currentPath: path ?? '',
          config: config ?? {}
        })
      }
    }
  }
  if (location.pathname.match(/^\/workbench\/modeling($|\/)/)) {
    return (
      <Suspense>
        <GlobalContext.Provider value={globalProviderValue}>
          <Spin tip={loading} spinning={!!loading}>
            <ModelingWrapper>{body}</ModelingWrapper>
          </Spin>
        </GlobalContext.Provider>
      </Suspense>
    )
  } else {
    return (
      <GlobalContext.Provider value={globalProviderValue}>
        <Spin tip={loading} spinning={!!loading}>
          <WorkbenchContext.Provider
            value={{
              engineStatus: info?.engineStatus,
              triggerPageEvent: (event: WorkbenchEvent) => {
                listener.current?.(event)
              },
              registerPageListener: fun => {
                listener.current = fun
              },
              refreshMap,
              onRefreshMenu: handleRefreshMenu,
              onRefreshState: () => setRefreshState(!refreshState),
              editFlag,
              markEdit,
              navCheck,
              setFullscreen: setFullScreen,
              isFullscreen: fullScreen,
              menuWidth: fullScreen ? 0 : MENU_WIDTH,
              setHideSide: setHideSider,
              isHideSide: hideSider,
              logout // treeNode: []
            }}
          >
            {body}
          </WorkbenchContext.Provider>
        </Spin>
      </GlobalContext.Provider>
    )
  }
}

function parseLogs(logs: string[]) {
  const result: { time: string; level: string; msg: string }[] = []
  let lastLog: any
  logs.forEach(log => {
    const [, time, level, msg] = log.match(/([^Z]+?Z) (\w+) (.*)/) || []
    if (time) {
      lastLog = {
        time: dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
        level,
        msg
      }
      result.push(lastLog)
    } else {
      if (lastLog) {
        lastLog.msg += '\n' + log.trim()
      }
    }
  })
  return result
}

async function resolveDefaultCode(
  path: string,
  hasParam: boolean,
  language: string
): Promise<string> {
  let getDefaultCode
  if (language === 'go') {
    getDefaultCode = getGoTemplate
  } else {
    getDefaultCode = getTsTemplate
  }
  const list = path.split('/')
  const name = list.pop()!
  const packageName = list[list.length - 1]
  let code = ''
  if (path.startsWith('global/')) {
    code = await getDefaultCode(`global.${name}`)
  } else if (path.startsWith('auth/')) {
    code = await getDefaultCode(`auth.${name}`)
  } else if (path.startsWith('customize/')) {
    code = replaceFileTemplate(await getDefaultCode('custom'), [
      { variableName: 'CUSTOMIZE_NAME', value: name }
    ])
  } else if (path.startsWith('uploads/')) {
    const profileName = list.pop() as string
    const storageName = list.pop() as string
    code = replaceFileTemplate(await getDefaultCode(`upload.${name}`), [
      { variableName: 'STORAGE_NAME', value: storageName },
      { variableName: 'PROFILE_NAME', value: profileName }
    ])
  } else {
    const pathList = list.slice(1)
    const tmplPath = `hook.${hasParam ? 'WithInput' : 'WithoutInput'}.${name}`
    code = replaceFileTemplate(await getDefaultCode(tmplPath), [
      {
        variableName: 'HOOK_NAME',
        value: pathList.join('__')
      }
    ])
  }
  return code.replaceAll('$HOOK_PACKAGE$', packageName!)
}
