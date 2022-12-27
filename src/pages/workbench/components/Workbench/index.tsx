import { Layout as ALayout, Modal } from 'antd'
import { PropsWithChildren, Suspense } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useImmer } from 'use-immer'

import type { Info } from '@/interfaces/common'
import type {
  MenuName,
  RefreshMap,
  WorkbenchEvent,
  WorkbenchListener
} from '@/lib/context/workbenchContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import events from '@/lib/event/events'
import requests from '@/lib/fetchers'
import { matchJson } from '@/lib/utils'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

import styles from './index.module.less'
import Header from './subs/Header'
import Sider from './subs/Sider'
import StatusBar from './subs/StatusBar'
import React from 'react'

const ModelingWrapper = React.lazy(() => import('@/pages/workbench/modeling/components/modelingWrapper'))

const Window = React.lazy(() => import('@/pages/workbench/components/Workbench/subs/Window'))
const { Header: AHeader, Footer: AFooter, Sider: ASider, Content: AContent } = ALayout

interface BarOnce {
  version: string
  env: string
}

export default function Index(props: PropsWithChildren) {
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

  useEffect(() => {
    void requests.get<unknown, BarOnce>('/wdg/barOnce').then(res => {
      setVersion(res.version)
      setEnv(res.env)
    })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    fetch(`/api/v1/wdg/state`, { signal }).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) return

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void data.text().then(res => {
            const status = matchJson(res).pop()
            if (status) {
              setInfo(status)
              // 发生变化才通知
              if (prevStatus.current) {
                if (status.engineStatus === ServiceStatus.Running) {
                  events.emit({ event: 'compileFinish' })
                } else if (
                  status.engineStatus === ServiceStatus.CompileFail ||
                  status.engineStatus === ServiceStatus.StartFail
                ) {
                  events.emit({ event: 'compileFail' })
                }
              }
              prevStatus.current = status
            }
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }

        // @ts-ignore
        void reader.read().then(process)
      }

      // @ts-ignore
      void reader.read().then(process)
    })

    return () => {
      console.log('finfinfin')
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
        title: '即将离开当前页面，为保存的内容将被都是，是否确认？',
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
            errorInfo={info?.errorInfo}
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
    return <Suspense><ModelingWrapper>{body}</ModelingWrapper></Suspense>
  } else {
    return (
      <WorkbenchContext.Provider
        value={{
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
