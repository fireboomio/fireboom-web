import { Layout as ALayout, Modal } from 'antd'
import { PropsWithChildren, useEffect, useState, useCallback } from 'react'
import { useImmer } from 'use-immer'
// import {wi} from 'react-router-dom'
// import { Router } from 'react-router-dom'
// Route.LifeR

import Player from '@/components/player'
import StatusBar from '@/components/status-bar'
import Window from '@/components/window'
import { Info } from '@/interfaces/common'
import { DOMAIN } from '@/lib/common'
import { WorkbenchContext, RefreshMap, MenuName } from '@/lib/context/workbench-context'
import requests from '@/lib/fetchers'

import Header from './components/header'
import Sider from './components/sider'
import styles from './index.module.scss'

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
  const [hideSider, setHideSider] = useState(false)

  // context
  const [editFlag, setEditFlag] = useState<boolean>(false)
  const [refreshMap, setRefreshMap] = useImmer<RefreshMap>({
    api: false,
    auth: false,
    dataSource: false,
    storage: false,
  })

  useEffect(() => {
    void requests.get<unknown, BarOnce>('/wdg/barOnce').then(res => {
      setVersion(res.version)
      setEnv(res.env)
    })
  }, [])
  useEffect(() => {
    void fetch(`${DOMAIN}/api/v1/wdg/state`).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) return

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void data.json().then(res => setInfo(res))
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
  }, [])

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
        onCancel: () => resolve(false),
      })
    })
  }, [editFlag])

  return (
    <WorkbenchContext.Provider
      value={{ refreshMap, onRefreshMenu: handleRefreshMenu, editFlag, markEdit, navCheck }}
    >
      <ALayout className="h-100vh">
        <AHeader className={styles.header}>
          <Header onToggleSider={() => setHideSider(!hideSider)} />
        </AHeader>
        <ALayout>
          <ASider
            width={230}
            style={{ marginLeft: hideSider ? -230 : 0 }}
            theme="light"
            className={styles.sider}
          >
            <Sider />
          </ASider>
          <ALayout className="relative">
            <AContent>{props.children}</AContent>
            {showWindow ? (
              <Window
                style={{ left: 0, right: 0, bottom: 0 }}
                toggleWindow={() => setShowWindow(!showWindow)}
              />
            ) : (
              <></>
            )}
          </ALayout>
        </ALayout>
        <AFooter className={styles.footer}>
          <StatusBar
            version={version}
            env={env}
            errorInfo={info?.errorInfo}
            engineStatus={info?.engineStatus}
            hookStatus={info?.hookStatus}
            toggleWindow={() => setShowWindow(!showWindow)}
          />
        </AFooter>
      </ALayout>
    </WorkbenchContext.Provider>
  )
}
