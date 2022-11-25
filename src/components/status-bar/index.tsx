/* eslint-disable react/prop-types */
import { Input, message, Radio, Space } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'

import type { ErrorInfo } from '@/interfaces/common'
import { ConfigContext, useConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import calcTime from '@/lib/helpers/calcTime'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

import styles from './index.module.less'
import { openStackblitz } from './open-stackblitz'

interface Props {
  className?: string
  env?: string
  version?: string
  startTime?: string
  errorInfo?: ErrorInfo
  engineStatus?: ServiceStatus
  hookStatus?: ServiceStatus
  toggleWindow: () => void
}
const statusMap = {
  [ServiceStatus.Compiling]: '编译中',
  [ServiceStatus.Starting]: '启动中',
  [ServiceStatus.Running]: '已启动',
  [ServiceStatus.CompileFail]: '编译失败',
  [ServiceStatus.StartFail]: '启动失败'
}

// eslint-disable-next-line react/prop-types
const StatusBar: React.FC<Props> = ({
  className,
  env,
  version,
  startTime,
  errorInfo,
  engineStatus,
  hookStatus,
  toggleWindow
}) => {
  const [compileTime, setCompileTime] = useState<string>()
  const [showHookSetting, setShowHookSetting] = useState<boolean>()
  const [hookSwitch, setHookSwitch] = useState<boolean>()
  const [hooksServerURL, setHooksServerURL] = useState<string>()
  const { config, refreshConfig } = useConfigContext()
  const { config: globalConfig } = useContext(ConfigContext)
  useEffect(() => {
    setHookSwitch(!!config.hooksServerURL)
    setHooksServerURL(config.hooksServerURL)
  }, [config.hooksServerURL, showHookSetting])

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
  }, [startTime])

  async function saveHookServerURL(str: string) {
    void requests.post('/setting', { key: 'hooksServerURL', val: str }).then(() => {
      refreshConfig()
    })
  }

  // 在线stackbliz调试
  const onlineDebug = useCallback(() => {
    openStackblitz(globalConfig.apiHost)
  }, [])

  return (
    <div className={className}>
      <div className={styles['status-bar']}>
        <span className={styles['info']}>
          <span className={styles.gitIcon} />
          <span className="mr-12">CONNECT GIT (BETA)</span>
          <span className={styles['info-env']}>
            <span>{env}</span>
          </span>
          <span className={styles['info-version']}>
            <span>FB: </span>
            <span className="ml-2">{version}</span>
          </span>
          <span onClick={toggleWindow} className="cursor-pointer flex items-center">
            <span className={styles.errLabel}>
              <img height={14} width={14} src="/assets/workbench/footer-error.png" alt="错误" />
              <span className="ml-2">{errorInfo?.errTotal ?? 0}</span>
            </span>
            <span className={styles.errLabel} style={{ marginLeft: 8 }}>
              <img height={14} width={14} src="/assets/workbench/footer-warning.png" alt="警告" />
              <span className="ml-2">{errorInfo?.warnTotal ?? 0}</span>
            </span>
          </span>
          <span className="ml-18">引擎状态：</span>
          <span className={styles.errLabel}>
            <div className="h-3px w-3px rounded-3px bg-[#50C772]" />
            <span className="ml-1 text-[#50C772]">
              {statusMap[engineStatus as ServiceStatus] ?? ''}
            </span>
          </span>
          <span className="ml-4.5">钩子状态：</span>
          <span className={styles.errLabel + ' cursor-pointer'}>
            <div
              className="flex items-center h-full"
              onClick={() => {
                if (!config.hooksServerURL) {
                  onlineDebug()
                }
                // setShowHookSetting(true)
              }}
            >
              <div className="h-3px w-3px rounded-3px bg-[#50C772]" />
              <span className="ml-1 text-[#50C772]">
                {statusMap[hookStatus as ServiceStatus] ?? ''}
              </span>
            </div>
            <div className={styles.split} />
            <div className="flex items-center h-full" onClick={() => setShowHookSetting(true)}>
              <div className={styles.hookEntry}>{config.hooksServerURL || 'WebContainer'}</div>
              <div
                className="ml-8px mr-5px"
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
                      setHookSwitch(e.target.value)
                      saveHookServerURL('')
                      if (e.target.value) {
                        void message.info('请手动启动钩子，并保证配置正确')
                      }
                    }}
                    value={hookSwitch}
                  >
                    <Space direction="vertical">
                      <Radio value={false}>WebContainer</Radio>
                      <Radio value={true}>手动设置</Radio>
                    </Space>
                  </Radio.Group>
                  <Input
                    className={styles.hookInput}
                    value={hooksServerURL}
                    onChange={e => setHooksServerURL(e.target.value)}
                    onPressEnter={() => {
                      if (hookSwitch) {
                        void saveHookServerURL(hooksServerURL ?? '')
                        setShowHookSetting(false)
                      }
                    }}
                    onBlur={() => {
                      if (hookSwitch) {
                        void saveHookServerURL(hooksServerURL ?? '')
                        setShowHookSetting(false)
                      }
                    }}
                  />
                </div>
              </>
            )}
          </span>
          <span className="ml-4.5">编译时间：</span>

          <span className={styles.errLabel}>
            <span className="ml-1 text-[#649FFF]">{compileTime}</span>
          </span>
        </span>
      </div>
    </div>
  )
}

export default StatusBar
