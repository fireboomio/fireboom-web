import { App, Layout as ALayout, message } from 'antd'
import dayjs from 'dayjs'
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
import { getAuthKey } from '@/lib/fetchers'
import { initWebSocket, sendMessageToSocket } from '@/lib/socket'
import { HookStatus, ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

import styles from './index.module.less'
import Header from './subs/Header'
import Sider from './subs/Sider'
import StatusBar from './subs/StatusBar'

const ModelingWrapper = React.lazy(
  () => import('@/pages/workbench/modeling/components/modelingWrapper')
)

const Window = React.lazy(() => import('@/pages/workbench/components/Workbench/subs/Window'))
const { Header: AHeader, Footer: AFooter, Sider: ASider, Content: AContent } = ALayout

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
    setLogs((data || []).map(parseLog))
  })
  useWebSocket('log', 'appendLog', data => {
    setLogs(logs.concat((data || []).map(parseLog)))
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
    const signal = controller.signal
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
            version={info?.fbVersion}
            commit={info?.fbCommit}
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

function parseLog(log: string) {
  const [, time, level, msg] = log.match(/([^Z]+?Z) (\w+) (.*)/) || []
  return {
    time: dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    level,
    msg
  }
}
