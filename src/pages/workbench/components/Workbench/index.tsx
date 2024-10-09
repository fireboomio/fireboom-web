import { Layout as ALayout, App, Button, Spin, message } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import type { PropsWithChildren } from 'react'
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import { QuestionType, useGlobal } from '@/hooks/global'
import { mutateApi } from '@/hooks/store/api'
import { mutateDataSource } from '@/hooks/store/dataSource'
import type { Info } from '@/interfaces/common'
import { useConfigContext } from '@/lib/context/ConfigContext'
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
import { updateGlobalOperationHookEnabled, updateOperationHookEnabled } from '@/lib/service/hook'
import { initWebSocket, sendMessageToSocket } from '@/lib/socket'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'
import { type EngineState, useEngine } from '@/providers/engine'
import { useNotification } from '@/providers/notification'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { resolveDefaultCode } from '@/utils/template'
import writeFile from '@/utils/uploadLocal'

import styles from './index.module.less'
import Header from './subs/Header'
import type { LicenseProps } from './subs/License'
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
  const [messageApi, contextHolder] = message.useMessage()
  const {
    engineStatus,
    setEngineState,
    computed: { isCompiling }
  } = useEngine()
  const [license, setLicense] = useState<LicenseProps | null>(null)
  const { setVersion } = useConfigContext()
  const [showWindow, setShowWindow] = useState(false)
  const [defaultWindowTab, setDefaultWindowTab] = useState<string>()
  const [hideSider, setHideSider] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const [refreshState, setRefreshState] = useState(false)
  const listener = useRef<WorkbenchListener>()
  const { addNotification, removeByTag, clear } = useNotification()
  const modelName = {
    datasource: intl.formatMessage({ defaultMessage: '数据源' }),
    operation: intl.formatMessage({ defaultMessage: 'API' }),
    teamwork: intl.formatMessage({ defaultMessage: '团队' }),
    prismaDatasource: intl.formatMessage({ defaultMessage: 'Prisma数据源' })
  } as const
  const [vscode, setVscode] = useState<{
    visible: boolean
    currentPath: string
    config: any
  }>({
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
  const { setLogs, logs, questions, setQuestions } = useGlobal(state => ({
    logs: state.logs,
    setLogs: state.setLogs,
    questions: state.questions,
    setQuestions: state.setQuestions
  }))

  const modelNameMap = useMemo(() => {
    return {
      [QuestionType.Authentication]: intl.formatMessage({
        defaultMessage: '身份认证'
      }),
      [QuestionType.Configuration]: intl.formatMessage({
        defaultMessage: '设置'
      }),
      [QuestionType.DataSource]: intl.formatMessage({
        defaultMessage: '数据源'
      }),
      [QuestionType.Operation]: intl.formatMessage({ defaultMessage: 'API' }),
      [QuestionType.Role]: intl.formatMessage({ defaultMessage: '角色管理' }),
      [QuestionType.SDK]: intl.formatMessage({ defaultMessage: '钩子模板' }),
      [QuestionType.Storage]: intl.formatMessage({
        defaultMessage: '文件存储'
      })
    }
  }, [intl])
  const modelRouteMap = useMemo(() => {
    return {
      [QuestionType.Authentication]: '/auth/{name}',
      [QuestionType.Configuration]: '/setting',
      [QuestionType.DataSource]: '/data-source/{name}',
      [QuestionType.Operation]: '/apimanage/{name}',
      [QuestionType.Role]: '/auth/role/role',
      [QuestionType.SDK]: '/sdk-template',
      [QuestionType.Storage]: '/storage/{name}'
    }
  }, [])

  const authKey = getAuthKey()
  function onHookReport({ time, status }: { time: string; status: number }) {
    let _status: EngineState['hookStatus'] = 'not_started'
    if (status === 200) {
      _status = 'running'
    } else if (status === 500) {
      _status = 'stopped'
    }
    setEngineState({ hookStatus: _status, hookStartTime: time })
  }
  // authkey变化时启动socket
  // FIXME 这段代码运行会导致vite直接报错退出
  useEffect(() => {
    initWebSocket(authKey ?? '')
  }, [authKey])
  useWebSocket('engine', 'pull', (data: Info) => {
    setVersion({
      fbVersion: data.fbVersion ?? '',
      fbCommit: data.fbCommit ?? ''
    })
    setEngineState(data)
    if (data.engineStatus === ServiceStatus.Started) {
      events.emit({ event: 'compileFinish', value: { first: true } })
    }
  })
  useWebSocket('engine', 'push', (data: Info) => {
    setEngineState({
      engineStatus: data.engineStatus,
      engineStartTime: data.engineStartTime
    })
    if (data.engineStatus === ServiceStatus.Started) {
      // 重启后拉下question
      sendMessageToSocket({ channel: 'question', event: 'pull' })
      void mutateApi()
      mutateDataSource()
      events.emit({ event: 'compileFinish' })
    }
  })
  useWebSocket('hookReport', 'pull', onHookReport)
  useWebSocket('hookReport', 'push', onHookReport)
  useWebSocket('log', 'pull', data => {
    setLogs(parseLogs(data))
  })
  useWebSocket('log', 'push', data => {
    setLogs(logs.concat(parseLogs([data])))
  })
  useWebSocket('question', 'pull', data => {
    removeByTag('question')
    setQuestions(data || [])
    if (data?.length) {
      addNotification({
        tag: 'question',
        title: intl.formatMessage(
          {
            defaultMessage: '构建中存在{count}条问题， 请检查'
          },
          { count: data.length }
        ),
        buttons: [
          {
            label: <FormattedMessage defaultMessage="查看" />,
            handler: () => {
              setShowWindow(true)
              setDefaultWindowTab('1')
            },
            type: 'primary'
          }
        ]
      })
    }
  })
  useWebSocket('question', 'push', data => {
    setQuestions([...questions, data])
    addNotification({
      tag: 'question-detail',
      title: data.msg,
      source: `${modelNameMap[data.model as keyof typeof modelNameMap]}[${data.name}]`,
      type: data.model === QuestionType.DataSource ? 'error' : 'warning',
      buttons: [
        {
          label: <FormattedMessage defaultMessage="前往查看" />,
          handler: () => {
            navigate(
              `/workbench${modelRouteMap[data.model as keyof typeof modelRouteMap].replace(
                '{name}',
                data.name
              )}`
            )
          },
          type: 'primary'
        }
      ]
    })
  })
  useWebSocket('license', 'pull', data => {
    setLicense(data)
  })
  useWebSocket('license', 'push', data => {
    messageApi.error(
      <div className="inline-flex flex-col items-start">
        <div>{data.msg}</div>
        <div>
          <FormattedMessage
            defaultMessage="当前{model}超出{limit}的限制"
            values={{
              model: modelName[data.data.function as keyof typeof modelName],
              limit: data.data.limits
            }}
          />
        </div>
        <div>
          <FormattedMessage defaultMessage="请访问" />
          <a className="mx-1" href={data.data.contractAddress} target="_blank" rel="noreferrer">
            {data.data.contractAddress}
          </a>
          <FormattedMessage defaultMessage="获取商业授权" />
        </div>
        <div className="mt-2 flex w-full">
          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
          <Button
            size="small"
            type="primary"
            className="ml-auto"
            onClick={() => messageApi.destroy()}
          >
            {intl.formatMessage({ defaultMessage: '知道了' })}
          </Button>
        </div>
      </div>,
      0
    )
    sendMessageToSocket({ channel: 'license', event: 'pull' })
  })
  useEffect(() => {
    sendMessageToSocket({ channel: 'engine', event: 'pull' })
    sendMessageToSocket({ channel: 'hookReport', event: 'pull' })
    sendMessageToSocket({ channel: 'log', event: 'pull' })
    sendMessageToSocket({ channel: 'question', event: 'pull' })
    sendMessageToSocket({ channel: 'license', event: 'pull' })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const headers = new Headers()
    headers.set('X-FB-Authentication', getAuthKey() ?? '')

    return () => {
      controller.abort()
    }
  }, [refreshState])

  useEffect(() => {
    // 重新编译时触发重置
    if (engineStatus === ServiceStatus.Building) {
      setQuestions([])
      setLogs([])
    }
  }, [engineStatus, setLogs, setQuestions])

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
    async (
      apiPublicAddr: string,
      opts?: {
        logoutProvider?: boolean
        closeWindow?: boolean
      }
    ) => {
      const res = await axios.get(`${apiPublicAddr}/auth/cookie/user/logout`, {
        headers: getHeader(),
        params: {
          logout_openid_connect_provider: opts?.logoutProvider ?? true
        },
        withCredentials: true
      })
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
    },
    [intl]
  )

  const body = (
    <ALayout className={`h-100vh ${styles.workbench}`}>
      {!fullScreen && (
        <AHeader className={styles.header}>
          <Header onToggleSider={() => setHideSider(!hideSider)} isCompiling={isCompiling} />
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
            license={license}
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
  const { data } = useSWRImmutable<ApiDocuments.Sdk>('/sdk/enabledServer', requests)
  const { data: sdk, mutate: refreshSDK } = useSWRImmutable<ApiDocuments.Sdk[]>(
    '/sdk',
    requests.get
  )
  const language = data?.language
  const isHookServerSelected = (!!language && sdk?.some(item => item.type === 'server')) ?? false
  const checkHookExist = async (path: string, hasParam = false, skipConfirm = false) => {
    try {
      if (!isHookServerSelected) {
        navigate('/workbench/sdk-template')
        message.warning(intl.formatMessage({ defaultMessage: '请选择钩子模版' }))
        return false
      }
      // 去除开头 /
      let filePath =
        data?.extension && path.includes(data!.extension)
          ? path
          : `${path}.${data?.extension.replace(/^\./, '')}`.replace(/^\//, '')
      // java 钩子需要文件首字母大写
      if (data?.upperFirst) {
        // 按路径分割，并将最后一个文件名首字母大写
        const splited = filePath.split('/')
        const last = splited[splited.length - 1]
        filePath = `${splited
          .slice(0, splited.length - 1)
          .join('/')}/${last[0].toUpperCase()}${last.slice(1)}`
      }
      let hookExisted = false
      try {
        await requests.get(`/vscode/state?uri=${filePath}`, {
          // @ts-ignore
          ignoreError: true
        })
        hookExisted = true
      } catch (error) {
        //
      }
      // const hook = await getHook(path)
      if (!hookExisted) {
        if (!skipConfirm) {
          const confirm = await new Promise(resolve => {
            modal.confirm({
              title: intl.formatMessage({
                defaultMessage: '钩子脚本不存在，是否创建？'
              }),
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
        const code = await resolveDefaultCode(filePath, data!)
        await writeFile(filePath, code)
        // await saveHookScript(path, code)
        return true
      }
      return true
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
      isHookServerSelected,
      checkHookExist,
      toggleOperationHook: async (
        flag: boolean,
        hookPath: string,
        operationName: string,
        hasParam = false
      ) => {
        // 打开钩子时，需要检查钩子文件
        if (flag && !(await checkHookExist(hookPath, hasParam))) {
          return
        }
        if (hookPath.match(/custom[-_]\w+\/global\//)) {
          await updateGlobalOperationHookEnabled(hookPath.split('/').pop()!, flag)
        } else {
          await updateOperationHookEnabled(operationName, hookPath.split('/').pop()!, flag)
        }
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
          return false
        }
        setVscode({
          visible: true,
          currentPath: path ?? '',
          config: config ?? {}
        })
        return true
      }
    }
  }
  if (location.pathname.match(/^\/workbench\/modeling($|\/)/)) {
    return (
      <Suspense>
        {contextHolder}
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
        {contextHolder}
        <Spin tip={loading} spinning={!!loading}>
          <WorkbenchContext.Provider
            value={{
              engineStatus,
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

function parseLogs(logs: string[] | null) {
  const result: { time: string; level: string; msg: string }[] = []
  let lastLog: any
  logs?.forEach(log => {
    // "2023-08-04T14:48:25.059688+08:00 INFO server/middleware.go:70 request log {"hostname": "erguotou.local", "pid": 58817, "detail": {"StartTime":"2023-08-04T14:48:25.058494+08:00","Latency":1139875,"Protocol":"","RemoteIP":"127.0.0.1","Host":"","Method":"GET","URI":"/api/sdk/enabledServer","URIPath":"/api/sdk/enabledServer","RoutePath":"","RequestID":"","Referer":"","UserAgent":"","Status":200,"Error":null,"ContentLength":"","ResponseSize":0,"Headers":null,"QueryParams":null,"FormValues":null}}
    const [, time, level, msg] = log.match(/([\d\w-:.+]+) (\w+) (.*)/) || []
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
