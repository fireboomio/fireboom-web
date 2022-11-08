/* eslint-disable react-hooks/exhaustive-deps */

import type { RadioChangeEvent } from 'antd'
import { Alert, Descriptions, Input, Radio, Switch } from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './subs.module.less'

dayjs.extend(duration)

interface systemConfig {
  apiHost: string
  apiPort: string
  oidcHost: string
  oidcPort: string
  debugSwitch: boolean
  devSwitch: boolean
  forcedJumpSwitch: boolean
  logLevel: string
  middlewarePort: string
  envType: string
}
interface Runtime {
  days: number
  hours: number
  minutes: number
  seconds: number
}
export default function SettingMainVersion() {
  const [isApiHostEditing, setIsApiHostEditing] = useImmer(false)
  const [isApiPortEditing, setIsApiPortEditing] = useImmer(false)
  const [isOidcHostEditing, setIsOidcHostEditing] = useImmer(false)
  const [isOidcPortEditing, setIsOidcPortEditing] = useImmer(false)
  const [isMidPortEditing, setIsMidPortEditing] = useImmer(false)
  const [systemConfig, setSystemConfig] = useImmer({} as systemConfig)
  const [count, setCount] = useImmer(0)
  const [refreshFlag, setRefreshFlag] = useState<boolean | null | undefined>()
  // const [value, setValue] = useState(true)

  useEffect(() => {
    void requests.get<unknown, systemConfig>('/setting/systemConfig').then(res => {
      setSystemConfig(res)
    })
  }, [refreshFlag])

  useEffect(() => {
    void requests
      .get<unknown, string>('/setting/getTime')
      .then(res => {
        const count = Date.parse(res)
        setCount(count)
      })
      .then(() => {
        setRefreshFlag(!refreshFlag)
      })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCount(count => count + 1), 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const onChange = (e: RadioChangeEvent, key: string) => {
    void requests.post('/setting', { key: key, val: e.target.value as boolean }).then(() => {
      setRefreshFlag(!refreshFlag)
    })
  }

  const calTime = (initTime: string) => {
    const time = dayjs.duration(dayjs().diff(dayjs(initTime), 'seconds'), 'seconds') as unknown as {
      $d: Runtime
    }
    return `${time.$d.days}天 ${time.$d.hours}时 ${time.$d.minutes}分 ${time.$d.seconds}秒`
  }

  const editPort = (key: string, value: string) => {
    if (value == '' && !['apiHost', 'oidcHost'].includes(key)) return
    void requests.post('/setting', { key: key, val: value }).then(() => {
      setRefreshFlag(!refreshFlag)
    })
  }
  return (
    <>
      {systemConfig.apiPort ? (
        <div className="pt-8 pl-8">
          <Descriptions
            colon={false}
            column={1}
            className={styles['descriptions-box']}
            labelStyle={{
              width: '15%'
            }}
          >
            <Descriptions.Item label="运行时长:">
              {calTime(dayjs(count).format('YYYY-MM-DD HH:mm:ss'))}
            </Descriptions.Item>
            <Descriptions.Item label="认证器域名:" className="w-20">
              {isOidcHostEditing ? (
                <Input
                  defaultValue={systemConfig.oidcHost}
                  autoFocus
                  style={{ width: '300px', height: '24px', paddingLeft: '6px' }}
                  type="text"
                  onBlur={e => {
                    setIsOidcHostEditing(!isOidcHostEditing)
                  }}
                />
              ) : (
                <span>{systemConfig.oidcHost}</span>
              )}
              <IconFont
                type="icon-bianji"
                className="ml-2"
                onClick={() => {
                  setIsOidcHostEditing(!isOidcHostEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="认证器端口:" className="w-20">
              {isOidcPortEditing ? (
                <Input
                  defaultValue={systemConfig.oidcPort}
                  autoFocus
                  style={{ width: '300px', height: '24px', paddingLeft: '6px' }}
                  type="text"
                  onBlur={e => {
                    setIsOidcPortEditing(!isOidcPortEditing)
                  }}
                />
              ) : (
                <span>{systemConfig.oidcPort}</span>
              )}
              <IconFont
                type="icon-bianji"
                className="ml-2"
                onClick={() => {
                  setIsOidcPortEditing(!isOidcPortEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="API域名:" className="w-20">
              {isApiHostEditing ? (
                <Input
                  defaultValue={systemConfig.apiHost}
                  autoFocus
                  style={{ width: '300px', height: '24px', paddingLeft: '6px' }}
                  type="text"
                  onBlur={e => {
                    setIsApiHostEditing(!isApiHostEditing)
                  }}
                />
              ) : (
                <span>{systemConfig.apiHost}</span>
              )}
              <IconFont
                type="icon-bianji"
                className="ml-2"
                onClick={() => {
                  setIsApiHostEditing(!isApiHostEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="API端口:" className="w-20">
              {isApiPortEditing ? (
                <Input
                  defaultValue={systemConfig.apiPort}
                  autoFocus
                  style={{ width: '300px', height: '24px', paddingLeft: '6px' }}
                  type="text"
                  onBlur={e => {
                    setIsApiPortEditing(!isApiPortEditing)
                  }}
                />
              ) : (
                <span>{systemConfig.apiPort}</span>
              )}
              <IconFont
                type="icon-bianji"
                className="ml-2"
                onClick={() => {
                  setIsApiPortEditing(!isApiPortEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="中间件端口:">
              {isMidPortEditing ? (
                <Input
                  defaultValue={systemConfig.middlewarePort}
                  autoFocus
                  type="text"
                  style={{ width: '300px', height: '24px', paddingLeft: '6px' }}
                  onBlur={e => {
                    setIsMidPortEditing(!isMidPortEditing)
                  }}
                />
              ) : (
                <span>{systemConfig.middlewarePort}</span>
              )}
              <IconFont
                type="icon-bianji"
                className="ml-2"
                onClick={() => {
                  setIsMidPortEditing(!isMidPortEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="日志水平:">
              <Radio.Group
                value={systemConfig.logLevel}
                onChange={e => {
                  onChange(e, 'logLevel')
                }}
              >
                <Radio value={'1'} className="mr-15 ">
                  info
                </Radio>
                <Radio value={'2'} className="mr-15">
                  debug
                </Radio>
                <Radio value={'3'}> error </Radio>
              </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label="开发环境">
              <Radio.Group
                value={systemConfig.devSwitch}
                onChange={e => {
                  onChange(e, 'devSwitch')
                }}
              >
                <Radio value={true} className="mr-15">
                  开发环境
                </Radio>
                <Radio value={false}>生产环境</Radio>
              </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label="调试:">
              <Switch
                onChange={value => {
                  void requests
                    .post('/setting', {
                      key: 'debugSwitch',
                      val: value
                    })
                    .then(() => {
                      setRefreshFlag(!refreshFlag)
                    })
                }}
                defaultChecked={systemConfig.debugSwitch}
                className={styles['switch-edit-btn']}
                size="small"
              />
            </Descriptions.Item>
            {!systemConfig.devSwitch ? (
              <Descriptions.Item label="强制跳转:">
                <Switch
                  checked={systemConfig.forcedJumpSwitch}
                  className={styles['switch-edit-btn']}
                  size="small"
                  onChange={value => {
                    void requests
                      .post('/setting', {
                        key: 'forcedJumpSwitch',
                        val: value
                      })
                      .then(() => {
                        setRefreshFlag(!refreshFlag)
                      })
                  }}
                />
              </Descriptions.Item>
            ) : null}
          </Descriptions>

          <div className="w-2/3">
            {/*<button*/}
            {/*  className={styles['edit-btn']}*/}
            {/*  onClick={() => {*/}
            {/*    void requests.get('/wdg/reStart')*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <span>重启</span>*/}
            {/*</button>*/}
            <Alert message="修改设置后，请重新编译" type="warning" showIcon />
          </div>
        </div>
      ) : null}
    </>
  )
}
