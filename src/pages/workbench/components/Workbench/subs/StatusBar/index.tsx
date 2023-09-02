/* eslint-disable react/prop-types */
import { MessageOutlined } from '@ant-design/icons'
import { Button, Form, Popover, Tooltip } from 'antd'
import type React from 'react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import InputOrFromEnvWithItem from '@/components/InputOrFromEnv'
import { NotificationButton } from '@/components/Notification'
import VsCode from '@/components/VsCode'
import { QuestionType, useGlobal } from '@/hooks/global'
import { useConfigContext } from '@/lib/context/ConfigContext'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import useCalcTime from '@/lib/helpers/calcTime'
import { sendMessageToSocket } from '@/lib/socket'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'
import { useEngine } from '@/providers/engine'
import { useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

import type { LicenseProps } from '../License'
import License from '../License'
import styles from './index.module.less'

interface Props {
  className?: string
  menuWidth: number
  license: LicenseProps | null
  toggleWindow: (defaultTa: string) => void
}

const devTipKey = 'dev.tip'

// eslint-disable-next-line react/prop-types
const StatusBar: React.FC<Props> = ({ className, menuWidth, toggleWindow, license }) => {
  const intl = useIntl()
  const { engineStartTime, fbCommit, fbVersion, engineStatus, hookStatus } = useEngine()
  const [showDevTip, setShowDevTip] = useState(localStorage.getItem(devTipKey) !== 'false')
  const { getConfigurationValue } = useConfigurationVariable()
  const calcTime = useCalcTime()
  const { questions } = useGlobal(state => ({
    questions: state.questions
  }))

  const statusMap = useMemo(
    () => ({
      [ServiceStatus.Building]: intl.formatMessage({ defaultMessage: '编译中' }),
      [ServiceStatus.EngineIncrementBuild]: intl.formatMessage({ defaultMessage: '增量编译中' }),
      [ServiceStatus.Built]: intl.formatMessage({ defaultMessage: '已编译' }),
      [ServiceStatus.BuildFailed]: intl.formatMessage({ defaultMessage: '编译失败' }),
      [ServiceStatus.Starting]: intl.formatMessage({ defaultMessage: '启动中' }),
      [ServiceStatus.EngineIncrementStart]: intl.formatMessage({ defaultMessage: '增量启动中' }),
      [ServiceStatus.Started]: intl.formatMessage({ defaultMessage: '已启动' }),
      [ServiceStatus.StartFailed]: intl.formatMessage({ defaultMessage: '启动失败' })
    }),
    [intl]
  )
  const [compileTime, setCompileTime] = useState<string>()
  const [showHookSetting, setShowHookSetting] = useState<boolean>()
  const { globalSetting, appRuntime, updateGlobalSetting } = useConfigContext()
  const navigate = useNavigate()
  const { vscode } = useContext(GlobalContext)

  const { data: sdk } = useSWRImmutable<ApiDocuments.Sdk[]>('/sdk', requests.get)
  useEffect(() => {
    if (!engineStartTime) {
      return
    }
    setCompileTime(calcTime(engineStartTime))
    const timer = setInterval(() => {
      setCompileTime(calcTime(engineStartTime))
    }, 60000)
    return () => {
      clearInterval(timer)
    }
  }, [engineStartTime, calcTime])

  const closeDevTip = () => {
    localStorage.setItem(devTipKey, 'false')
    setShowDevTip(false)
  }

  return (
    <div className={className}>
      <div className={styles['status-bar']}>
        <span className={styles['info']}>
          {/*<span className={styles.gitIcon} />*/}
          {/*<span className="mr-12">CONNECT GIT (BETA)</span>*/}
          <span className={styles['info-env'] + ' mr-2'}>
            {appRuntime.dev ? (
              <Tooltip
                open={showDevTip}
                arrow
                title={
                  <div className="flex items-center">
                    <FormattedMessage defaultMessage="请勿将开发模式用于生产" />
                    <span className="ml-4 cursor-pointer" onClick={closeDevTip}>
                      <FormattedMessage defaultMessage="知道了" />
                    </span>
                  </div>
                }
              >
                <span>
                  <FormattedMessage defaultMessage="开发模式" />
                </span>
              </Tooltip>
            ) : (
              <FormattedMessage defaultMessage="生产模式" />
            )}
          </span>
          <span className={styles['info-version'] + ' mr-2'}>
            <span>FB:</span>
            <Tooltip title={fbCommit}>
              <span className="">{fbVersion}</span>
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
              <img
                height={14}
                width={14}
                src={`${import.meta.env.BASE_URL}assets/workbench/footer-error.png`}
                alt="错误"
              />
              <span className="ml-2">
                {questions.filter(x => x.model === QuestionType.DataSource).length}
              </span>
            </span>
            <span className={styles.errLabel} style={{ marginLeft: 8 }}>
              <img
                height={14}
                width={14}
                src={`${import.meta.env.BASE_URL}assets/workbench/footer-warning.png`}
                alt="警告"
              />
              <span className="ml-2">
                {questions.filter(x => x.model !== QuestionType.DataSource).length}
              </span>
            </span>
          </span>
          <span className="ml-3">
            {' '}
            <FormattedMessage defaultMessage="引擎" />:{' '}
          </span>
          <span className={styles.errLabel + ' ml-1'}>
            {engineStatus === ServiceStatus.BuildFailed ||
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
          <span className="ml-3">
            {' '}
            <FormattedMessage defaultMessage="钩子" />:{' '}
          </span>
          <span className={styles.errLabel + ' cursor-pointer ml-1'}>
            <div className="flex h-full items-center">
              <div
                className={
                  'rounded-3px h-3px w-3px' + (hookStatus ? ' bg-[#50C772]' : ' bg-[#f0b763]')
                }
              />
              <span className={'ml-1 ' + (hookStatus ? 'text-[#50C772]' : 'text-[#f0b763]')}>
                {hookStatus
                  ? intl.formatMessage({ defaultMessage: '已启动' })
                  : intl.formatMessage({ defaultMessage: '未启动' })}
              </span>
              <div
                className="flex h-full pl-1 items-center"
                onClick={e => {
                  sendMessageToSocket({ channel: 'hookReport', event: 'pull' })
                  e.stopPropagation()
                }}
              >
                <img alt="" src="assets/refresh.svg" />
              </div>
            </div>
            <div className={styles.split} />
            <div className="flex h-full items-center" onClick={() => setShowHookSetting(true)}>
              <div className={styles.hookEntry}>
                {getConfigurationValue(globalSetting.serverOptions.serverUrl)}
              </div>
              <div
                className="mr-5px ml-8px"
                style={{ transform: showHookSetting ? 'rotate(180deg)' : '' }}
              >
                <img alt="" src={`${import.meta.env.BASE_URL}assets/hook-arrow.svg`} />
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
                  <Form
                    initialValues={globalSetting.serverOptions}
                    onFinish={v => {
                      updateGlobalSetting({
                        serverOptions: {
                          ...globalSetting.serverOptions,
                          ...v
                        }
                      })
                    }}
                  >
                    <div className="pt-2 text-[#999] text-sm">
                      <FormattedMessage defaultMessage="钩子服务地址" />
                    </div>
                    <div className="mt-2 flex items-center flex-1">
                      <InputOrFromEnvWithItem
                        formItemProps={{
                          name: 'serverUrl',
                          className: 'flex-1'
                        }}
                        inputProps={{
                          placeholder: 'http://localhost:9992'
                        }}
                        required
                      />
                      <Button htmlType="submit" className="ml-2 mb-5" type="primary">
                        保存
                      </Button>
                    </div>
                  </Form>
                </div>
              </>
            )}
          </span>

          <div
            className={styles.entry + ' cursor-pointer'}
            onClick={() => navigate('/workbench/sdk-template')}
          >
            <FormattedMessage defaultMessage="钩子模版" />:
            <span className={styles.label}>
              {sdk?.find(item => item.type === 'server' && item.enabled)?.language ?? '未选择'}
            </span>
          </div>
          <div
            className={styles.entry + ' cursor-pointer'}
            onClick={() => navigate('/workbench/sdk-template')}
          >
            <FormattedMessage defaultMessage="客户端模版" />:
            <span className={styles.label}>
              {sdk?.filter(item => item.type === 'client')?.length ?? 0}
            </span>
          </div>
          <div className={styles.entry}>
            <FormattedMessage defaultMessage="编译时间" />:
            <span className={styles.label}>{compileTime}</span>
          </div>
        </span>
        <span className="ml-auto">{license && <License {...license} />}</span>
        <span
          className="bg-white rounded-sm cursor-pointer ml-4 text-xs py-0.5 px-1 text-[#326d9f]"
          onClick={() => {
            vscode?.options?.visible ? vscode.hide() : vscode.show()
          }}
        >
          <FormattedMessage defaultMessage="钩子编辑器⇪" />
        </span>
        <NotificationButton className="bg-white rounded-sm cursor-pointer ml-4 text-xs py-0.5 px-1 text-[#326d9f] inline-flex items-center" />
      </div>
      <VsCode
        className="top-9 z-1000 fixed"
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
