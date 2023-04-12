/* eslint-disable react/prop-types */
import { Radio, Space, Tag, Tooltip } from 'antd'
import { throttle } from 'lodash'
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import VsCode from '@/components/VsCode'
import { QuestionType, useGlobal } from '@/hooks/global'
import { useConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import useCalcTime from '@/lib/helpers/calcTime'
import { sendMessageToSocket } from '@/lib/socket'
import { HookStatus, ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

import styles from './index.module.less'

const UrlInput = React.lazy(() => import('@/components/UrlInput'))

interface Props {
  className?: string
  commit?: string
  version?: string
  startTime?: string
  engineStatus?: ServiceStatus
  hookStatus?: HookStatus
  menuWidth: number
  toggleWindow: (defaultTa: string) => void
}

// eslint-disable-next-line react/prop-types
const StatusBar: React.FC<Props> = ({
  className,
  startTime,
  engineStatus,
  hookStatus,
  menuWidth,
  toggleWindow,
  commit,
  version
}) => {
  const intl = useIntl()
  const calcTime = useCalcTime()
  const { questions } = useGlobal(state => ({
    questions: state.questions
  }))

  const statusMap = useMemo(
    () => ({
      [ServiceStatus.Building]: intl.formatMessage({ defaultMessage: '编译中' }),
      [ServiceStatus.Starting]: intl.formatMessage({ defaultMessage: '启动中' }),
      [ServiceStatus.Started]: intl.formatMessage({ defaultMessage: '已启动' }),
      [ServiceStatus.StartFailed]: intl.formatMessage({ defaultMessage: '启动失败' }),
      [ServiceStatus.BuildFailed]: intl.formatMessage({ defaultMessage: '编译失败' }),
      [ServiceStatus.Built]: intl.formatMessage({ defaultMessage: '已编译' }),
      [ServiceStatus.NotStarted]: intl.formatMessage({ defaultMessage: '未启动' })
    }),
    [intl]
  )
  const hookStatusMap = useMemo(
    () => ({
      [HookStatus.Running]: intl.formatMessage({ defaultMessage: '已启动' }),
      [HookStatus.Stopped]: intl.formatMessage({ defaultMessage: '未启动' })
    }),
    [intl]
  )
  const [compileTime, setCompileTime] = useState<string>()
  const [showHookSetting, setShowHookSetting] = useState<boolean>()
  const [hookOptionStatus, setHookOptionStatus] = useState<{
    webContainer: HookStatus
    customer: HookStatus
    default: HookStatus
  }>()
  const [hookEnabled, setHookEnabled] = useState<number>()
  const [hooksServerURL, setHooksServerURL] = useState<string>()
  const { system, refreshConfig } = useConfigContext()
  const navigate = useNavigate()
  const { data: sdkList } = useSWRImmutable<any[]>('/sdk', requests.get)
  const [vscodeVisible, setVscodeVisible] = useState<boolean>(false)
  const webContainerUrl = useMemo(() => {
    const url = new URL(window.location.href)
    url.port = '9123'
    return url.origin + '/ws'
  }, [])
  useEffect(() => {
    if (system.hooksServerURL === webContainerUrl) {
      setHookEnabled(1)
      setHooksServerURL(localStorage.getItem('hooksServerURL') || '')
    } else {
      setHooksServerURL(system.hooksServerURL)
      localStorage.setItem('hooksServerURL', system.hooksServerURL)
      setHookEnabled(3)
    }
  }, [system.hooksServerURL, showHookSetting, webContainerUrl])
  useEffect(() => {
    if (showHookSetting) {
      fetchHookOptionStatus(hooksServerURL ?? '')
    }
  }, [hooksServerURL, showHookSetting])
  const fetchHookOptionStatus = useCallback(
    throttle(async (url: string) => {
      try {
        const data: any = await requests.get(`/hook/status?url=${encodeURIComponent(url)}`)
        setHookOptionStatus(data)
      } catch (error) {
        console.error(error)
      }
    }, 2000),
    []
  )
  useEffect(() => {
    if (!startTime) {
      return
    }
    setCompileTime(calcTime(startTime))
    const timer = setInterval(() => {
      setCompileTime(calcTime(startTime))
    }, 60000)
    return () => {
      clearInterval(timer)
    }
  }, [startTime, calcTime])

  async function saveHookServerURL(str: string) {
    void requests
      .put('/setting/system', { values: [{ key: 'system.hooksServerURL', val: str }] })
      .then(() => {
        refreshConfig()
        sendMessageToSocket({ channel: 'engine', event: 'getStatus' })
      })
  }

  // 在线stackbliz调试
  const onlineDebug = useCallback(() => {
    // openHookServer()
    window.open('https://stackblitz.com/local', '_blank')
  }, [])

  return (
    <div className={className}>
      <div className={styles['status-bar']}>
        <span className={styles['info']}>
          {/*<span className={styles.gitIcon} />*/}
          {/*<span className="mr-12">CONNECT GIT (BETA)</span>*/}
          <span className={styles['info-env'] + ' mr-2'}>
            <span>
              {system?.isDev === true ? intl.formatMessage({ defaultMessage: '开发模式' }) : ''}
              {system?.isDev === false ? intl.formatMessage({ defaultMessage: '生产模式' }) : ''}
            </span>
          </span>
          <span className={styles['info-version'] + ' mr-2'}>
            <span>FB:</span>
            <Tooltip title={commit}>
              <span className="">{version}</span>
            </Tooltip>
          </span>

          <span
            onClick={() => {
              toggleWindow('0')
            }}
            className={styles.errLabel + ' mr-2 cursor-pointer'}
          >
            <span>
              <FormattedMessage defaultMessage="日志" />
            </span>
          </span>
          <span
            onClick={() => {
              toggleWindow('1')
            }}
            className="cursor-pointer flex items-center"
          >
            <span className={styles.errLabel}>
              <img height={14} width={14} src="/assets/workbench/footer-error.png" alt="错误" />
              <span className="ml-2">
                {questions.filter(x => x.model === QuestionType.DatasourceQuestion).length}
              </span>
            </span>
            <span className={styles.errLabel} style={{ marginLeft: 8 }}>
              <img height={14} width={14} src="/assets/workbench/footer-warning.png" alt="警告" />
              <span className="ml-2">
                {questions.filter(x => x.model !== QuestionType.DatasourceQuestion).length}
              </span>
            </span>
          </span>
          <span className="ml-8">
            {' '}
            <FormattedMessage defaultMessage="引擎" />:{' '}
          </span>
          <span className={styles.errLabel}>
            {engineStatus === ServiceStatus.NotStarted ? (
              <>
                <div className="bg-[#cd3021] rounded-3px h-3px w-3px" />
                <Tooltip
                  open={true}
                  title={intl.formatMessage({ defaultMessage: '请配置或开启数据源' })}
                >
                  <span className="ml-1 text-[#cd3021]">
                    {statusMap[engineStatus as ServiceStatus] ?? ''}
                  </span>
                </Tooltip>
              </>
            ) : engineStatus === ServiceStatus.BuildFailed ||
              engineStatus === ServiceStatus.StartFailed ? (
              <>
                <div className="bg-[#cd3021] rounded-3px h-3px w-3px" />
                <Tooltip
                  open={true}
                  title={intl.formatMessage({ defaultMessage: '请检查项目配置并重启fireboom' })}
                >
                  <span className="ml-1 text-[#cd3021]">
                    {statusMap[engineStatus as ServiceStatus] ?? ''}
                  </span>
                </Tooltip>
              </>
            ) : (
              <>
                <div className="bg-[#50C772] rounded-3px h-3px w-3px" />
                <span className="ml-1 text-[#50C772]">
                  {statusMap[engineStatus as ServiceStatus] ?? ''}
                </span>
              </>
            )}
          </span>
          <span className="ml-4.5">
            {' '}
            <FormattedMessage defaultMessage="钩子" />:{' '}
          </span>
          <span className={styles.errLabel + ' cursor-pointer mr-2'}>
            <div
              className="flex h-full items-center"
              onClick={() => {
                if (hookEnabled === 1) {
                  onlineDebug()
                }
                // setShowHookSetting(true)
              }}
            >
              <div
                className={
                  'rounded-3px h-3px w-3px' +
                  (hookStatus === HookStatus.Running ? ' bg-[#50C772]' : ' bg-[#f0b763]')
                }
              />
              <span
                className={
                  'ml-1 ' +
                  (hookStatus === HookStatus.Running ? 'text-[#50C772]' : 'text-[#f0b763]')
                }
              >
                {hookStatusMap[hookStatus as HookStatus] ?? ''}
              </span>
              <div
                className="flex h-full pl-1 items-center"
                onClick={e => {
                  sendMessageToSocket({ channel: 'engine', event: 'getHookStatus' })
                  e.stopPropagation()
                }}
              >
                <img alt="" src="assets/refresh.svg" />
              </div>
            </div>
            <div className={styles.split} />
            <div className="flex h-full items-center" onClick={() => setShowHookSetting(true)}>
              <div className={styles.hookEntry}>
                {hookEnabled === 1 ? 'WebContainer' : system.hooksServerURL}
              </div>
              <div
                className="mr-5px ml-8px"
                style={{ transform: showHookSetting ? 'rotate(180deg)' : '' }}
              >
                <img alt="" src="/assets/hook-arrow.svg" />
              </div>
            </div>
            {showHookSetting && (
              <>
                <div
                  className={styles.hookMask}
                  onClick={e => {
                    e.stopPropagation()
                    setShowHookSetting(false)
                  }}
                />
                <div
                  className={styles.hookContainer + ' common-form'}
                  onClick={e => {
                    e.stopPropagation()
                  }}
                >
                  <Radio.Group
                    onChange={e => {
                      setHookEnabled(e.target.value)
                      const map: Record<string, string | undefined> = {
                        '1': webContainerUrl,
                        '3': hooksServerURL
                      }
                      const url: string = map[e.target.value] ?? ''
                      saveHookServerURL(url)
                      // if (e.target.value) {
                      //   if (hookOptionStatus?.Customer !== HookStatus.Running) {
                      //     message.info(
                      //       intl.formatMessage({
                      //         defaultMessage: '当前地址的钩子服务未启动，手动启动钩子后，方可使用。'
                      //       })
                      //     )
                      //   }
                      //   saveHookServerURL(hooksServerURL ?? '')
                      // } else {
                      //   saveHookServerURL('')
                      // }
                    }}
                    value={hookEnabled}
                  >
                    <Space direction="vertical">
                      <Radio value={1}>
                        WebContainer
                        {hookOptionStatus?.webContainer === HookStatus.Running && (
                          <Tag className="!ml-2" color="success">
                            <FormattedMessage defaultMessage="已启动" />
                          </Tag>
                        )}
                        {hookOptionStatus?.webContainer === HookStatus.Stopped && (
                          <Tag className="!ml-2" color="warning">
                            <FormattedMessage defaultMessage="未启动" />
                          </Tag>
                        )}
                      </Radio>
                      <Radio value={3}>
                        <FormattedMessage defaultMessage="手动设置" />
                        {hookOptionStatus?.customer === HookStatus.Running && (
                          <Tag className="!ml-2" color="success">
                            <FormattedMessage defaultMessage="已启动" />
                          </Tag>
                        )}
                        {hookOptionStatus?.customer === HookStatus.Stopped && (
                          <Tag className="!ml-2" color="warning">
                            <FormattedMessage defaultMessage="未启动" />
                          </Tag>
                        )}
                      </Radio>
                    </Space>
                  </Radio.Group>
                  <Suspense>
                    <UrlInput
                      className="mt-2"
                      selectClassName="!z-13000"
                      value={hooksServerURL}
                      onChange={val => {
                        if (hookEnabled === 3) {
                          saveHookServerURL(val)
                        }
                        setHooksServerURL(val)
                        localStorage.setItem('hooksServerURL', val)
                      }}
                    />
                  </Suspense>
                </div>
              </>
            )}
          </span>
          <span
            className={styles.errLabel + ' mr-2 cursor-pointer'}
            onClick={() => navigate('/workbench/sdk-template')}
          >
            <span>
              <FormattedMessage defaultMessage="SDK 模板:" />
              &nbsp;
              {sdkList?.length ?? 0}
            </span>
          </span>
          <span className="ml-4.5">
            <FormattedMessage defaultMessage="编译时间" />:{' '}
          </span>

          <span className={styles.errLabel}>
            <span className="ml-1 text-[#649FFF]">{compileTime}</span>
          </span>
        </span>
        <span
          className="bg-white rounded-sm cursor-pointer ml-auto mr-2 text-xs py-0.5 px-1 text-[#326d9f]"
          onClick={() => {
            setVscodeVisible(!vscodeVisible)
          }}
        >
          <FormattedMessage defaultMessage="钩子编辑器⇪" />
        </span>
      </div>
      <VsCode
        className="top-9 z-1000 fixed"
        visible={vscodeVisible}
        style={{
          left: `${menuWidth}px`,
          width: `calc(100vw - ${menuWidth}px)`,
          height: `calc(100vh - 64px)`
        }}
      />
    </div>
  )
}

export default StatusBar
