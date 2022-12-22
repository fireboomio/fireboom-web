/* eslint-disable react/prop-types */
import { Input, message, Radio, Select, Space } from 'antd'
import { useCallback, useEffect, useState } from 'react'

import { useStackblitz } from '@/hooks/stackblitz'
import type { ErrorInfo } from '@/interfaces/common'
import { useConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import calcTime from '@/lib/helpers/calcTime'
import { ServiceStatus, HookStatus } from '@/pages/workbench/apimanage/crud/interface'

import styles from './index.module.less'

const { Option } = Select
interface Props {
  className?: string
  env?: string
  version?: string
  startTime?: string
  errorInfo?: ErrorInfo
  engineStatus?: ServiceStatus
  hookStatus?: HookStatus
  toggleWindow: (defaultTa: string) => void
}
const statusMap = {
  [ServiceStatus.Compiling]: '编译中',
  [ServiceStatus.Starting]: '启动中',
  [ServiceStatus.Running]: '已启动',
  [ServiceStatus.CompileFail]: '编译失败',
  [ServiceStatus.StartFail]: '启动失败'
}
const hookStatusMap = {
  [HookStatus.Running]: '已启动',
  [HookStatus.Stopped]: '未启动'
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
  const [hooksServerProtocol, setHooksServerProtocol] = useState<string>()
  const { config, refreshConfig } = useConfigContext()
  const { openHookServer, loading: hookServerLoading } = useStackblitz()

  useEffect(() => {
    const [_, protocol, url] = config?.hooksServerURL?.match(/^(https?:\/\/)?(.*)$/) || []
    setHookSwitch(!!config.hooksServerURL)
    setHooksServerURL(url)
    setHooksServerProtocol(protocol === 'http://' ? 'http://' : 'https://')
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
    openHookServer()
  }, [])

  return (
    <div className={className}>
      <div className={styles['status-bar']}>
        <span className={styles['info']}>
          <span className={styles.gitIcon} />
          <span className="mr-12">CONNECT GIT (BETA)</span>
          <span className={styles['info-env'] + ' mr-2'}>
            <span>{env}</span>
          </span>
          <span className={styles['info-version'] + ' mr-2'}>
            <span>FB:</span>
            <span className="">{version}</span>
          </span>

          <span
            onClick={() => {
              toggleWindow('0')
            }}
            className={styles.errLabel + ' mr-2 cursor-pointer'}
          >
            <span>日志</span>
          </span>
          <span
            onClick={() => {
              toggleWindow('1')
            }}
            className="cursor-pointer flex items-center"
          >
            <span className={styles.errLabel}>
              <img height={14} width={14} src="/assets/workbench/footer-error.png" alt="错误" />
              <span className="ml-2">{errorInfo?.errTotal ?? 0}</span>
            </span>
            <span className={styles.errLabel} style={{ marginLeft: 8 }}>
              <img height={14} width={14} src="/assets/workbench/footer-warning.png" alt="警告" />
              <span className="ml-2">{errorInfo?.warnTotal ?? 0}</span>
            </span>
          </span>
          <span className="ml-8">引擎状态：</span>
          <span className={styles.errLabel}>
            <div className="bg-[#50C772] rounded-3px h-3px w-3px" />
            <span className="ml-1 text-[#50C772]">
              {statusMap[engineStatus as ServiceStatus] ?? ''}
            </span>
          </span>
          <span className="ml-4.5">钩子状态：</span>
          <span className={styles.errLabel + ' cursor-pointer'}>
            <div
              className="flex h-full items-center"
              onClick={() => {
                if (!config.hooksServerURL && !hookServerLoading) {
                  onlineDebug()
                }
                // setShowHookSetting(true)
              }}
            >
              <div className="bg-[#50C772] rounded-3px h-3px w-3px" />
              <span className="ml-1 text-[#50C772]">
                {hookStatusMap[hookStatus as HookStatus] ?? ''}
              </span>
            </div>
            <div className={styles.split} />
            <div className="flex h-full items-center" onClick={() => setShowHookSetting(true)}>
              <div className={styles.hookEntry}>{config.hooksServerURL || 'WebContainer'}</div>
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
                  <Input.Group compact>
                    <Select
                      className="w-2/5"
                      popupClassName="!z-13000"
                      value={hooksServerProtocol}
                      onChange={setHooksServerProtocol}
                    >
                      <Option value="https://">https://</Option>
                      <Option value="http://">http://</Option>
                    </Select>
                    <Input
                      style={{ width: '60%' }}
                      className={styles.hookInput}
                      value={hooksServerURL}
                      onChange={e => setHooksServerURL(e.target.value)}
                      onPressEnter={() => {
                        if (hookSwitch) {
                          void saveHookServerURL(`${hooksServerProtocol}${hooksServerURL ?? ''}`)
                          setShowHookSetting(false)
                        }
                      }}
                      onBlur={() => {
                        if (hookSwitch) {
                          void saveHookServerURL(`${hooksServerProtocol}${hooksServerURL ?? ''}`)
                          setShowHookSetting(false)
                        }
                      }}
                    />
                  </Input.Group>
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
