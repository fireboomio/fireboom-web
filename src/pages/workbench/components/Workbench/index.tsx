import { Layout as ALayout, Modal } from 'antd'
import type { PropsWithChildren } from 'react'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import { useImmer } from 'use-immer'

import { useGlobal } from '@/hooks/global'
import { mutateApi } from '@/hooks/store/api'
import type { Info } from '@/interfaces/common'
import type {
  MenuName,
  RefreshMap,
  WorkbenchEvent,
  WorkbenchListener
} from '@/lib/context/workbenchContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import events, { useWebSocket } from '@/lib/event/events'
import requests, { getAuthKey } from '@/lib/fetchers'
import { initWebSocket, sendMessageToSocket } from '@/lib/socket'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

import styles from './index.module.less'
import Header from './subs/Header'
import Sider from './subs/Sider'
import StatusBar from './subs/StatusBar'

const ModelingWrapper = React.lazy(
  () => import('@/pages/workbench/modeling/components/modelingWrapper')
)

const Window = React.lazy(() => import('@/pages/workbench/components/Workbench/subs/Window'))
const { Header: AHeader, Footer: AFooter, Sider: ASider, Content: AContent } = ALayout

interface BarOnce {
  version: string
  env: string
}

export default function Index(props: PropsWithChildren) {
  const intl = useIntl()
  const [info, setInfo] = useState<Info>()
  const [version, setVersion] = useState<string>('--')
  const [env, setEnv] = useState<string>('--')
  const [showWindow, setShowWindow] = useState(false)
  const [defaultWindowTab, setDefaultWindowTab] = useState<string>()
  const [hideSider, setHideSider] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const [refreshState, setRefreshState] = useState(false)
  const listener = useRef<WorkbenchListener>()
  const prevStatus = useRef<any>()

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

  useEffect(() => {
    void requests.get<unknown, BarOnce>('/engine/barOnce').then(res => {
      setVersion(res.version)
      setEnv(res.env)
    })
  }, [])
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
    // @ts-ignore
    setInfo({ ...info, engineStatus: data.engineStatus, startTime: data.startTime })
    if (data.engineStatus === ServiceStatus.Started) {
      void mutateApi()
      events.emit({ event: 'compileFinish' })
    }
  })
  useWebSocket('engine', 'getHookStatus', data => {
    // @ts-ignore
    setInfo({ ...info, hookStatus: data.hookStatus })
  })
  useWebSocket('log', 'getLogs', data => {
    setLogs(data.logs)
  })
  useWebSocket('log', 'appendLog', data => {
    setLogs(logs.concat(data.logs))
  })
  useWebSocket('question', 'getQuestions', data => {
    setQuestions(data.questions)
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
    const signal = controller.signal
    const headers = new Headers()
    headers.set('X-FB-Authentication', getAuthKey() ?? '')
    // fetch(`/api/v1/wdg/state`, { signal, headers }).then(res => {
    //   const reader = res.body?.getReader()
    //   if (!reader) return
    //
    //   // @ts-ignore
    //   const process = ({ value, done }) => {
    //     if (done) return
    //
    //     try {
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //       const data = new Response(value)
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //       void data.text().then(res => {
    //         const status = matchJson(res).pop()
    //         status.engineStatus = ServiceStatus.Running
    //         if (status) {
    //           setInfo(status)
    //           // 发生变化才通知
    //           if (prevStatus.current) {
    //             if (status.engineStatus === ServiceStatus.Running) {
    //               events.emit({ event: 'compileFinish' })
    //             } else if (
    //               status.engineStatus === ServiceStatus.CompileFail ||
    //               status.engineStatus === ServiceStatus.StartFail
    //             ) {
    //               events.emit({ event: 'compileFail' })
    //             }
    //           }
    //           prevStatus.current = status
    //         }
    //       })
    //     } catch (error) {
    //       // eslint-disable-next-line no-console
    //       console.log(error)
    //     }
    //
    //     // @ts-ignore
    //     void reader.read().then(process)
    //   }
    //
    //   // @ts-ignore
    //   void reader.read().then(process)
    // })

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
  const navCheck = useCallback(async () => {
    if (!editFlag) {
      return true
    }
    return await new Promise<boolean>(resolve => {
      Modal.confirm({
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
  }, [editFlag])

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
          width={230}
          style={{ marginLeft: hideSider || fullScreen ? -230 : 0 }}
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
            version={version}
            env={env}
            startTime={info?.startTime}
            engineStatus={info?.engineStatus}
            hookStatus={info?.hookStatus}
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
  if (location.pathname.match(/^\/workbench\/modeling($|\/)/)) {
    return (
      <Suspense>
        <ModelingWrapper>{body}</ModelingWrapper>
      </Suspense>
    )
  } else {
    return (
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
          setHideSide: setHideSider,
          isHideSide: hideSider
          // treeNode: []
        }}
      >
        {body}
      </WorkbenchContext.Provider>
    )
  }
}
