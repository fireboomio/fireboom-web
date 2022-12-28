/* eslint-disable react-hooks/exhaustive-deps */

import type { RadioChangeEvent } from 'antd'
import { Alert, Descriptions, Input, Radio, Switch } from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './components/subs/subs.module.less'

dayjs.extend(duration)

interface systemConfig {
  apiHost: string
  apiPort: string
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
  const intl = useIntl()
  const [isApiHostEditing, setIsApiHostEditing] = useImmer(false)
  const [isApiPortEditing, setIsApiPortEditing] = useImmer(false)
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
    return intl.formatMessage(
      { defaultMessage: '{days}天 {hours}时 {minutes}分 {seconds}秒' },
      {
        days: time.$d.days,
        hours: time.$d.hours,
        minutes: time.$d.minutes,
        seconds: time.$d.seconds
      }
    )
  }

  const editPort = (key: string, value: string) => {
    if (value == '' && !['apiHost'].includes(key)) return
    void requests.post('/setting', { key: key, val: value }).then(() => {
      setRefreshFlag(!refreshFlag)
    })
  }
  return (
    <>
      {systemConfig.apiPort ? (
        <div className="pt-8 pl-8">
          <Descriptions
            colon
            column={1}
            className={styles['descriptions-box']}
            labelStyle={{
              width: '15%'
            }}
          >
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: '运行时长' })}>
              {calTime(dayjs(count).format('YYYY-MM-DD HH:mm:ss'))}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({ defaultMessage: 'API域名' })}
              className="w-20"
            >
              {isApiHostEditing ? (
                <Input
                  defaultValue={systemConfig.apiHost}
                  autoFocus
                  style={{ width: '300px', height: '24px', paddingLeft: '6px' }}
                  type="text"
                  onBlur={e => {
                    setIsApiHostEditing(!isApiHostEditing)
                    void editPort('apiHost', e.target.value)
                  }}
                  onPressEnter={e => {
                    setIsApiHostEditing(!isApiHostEditing)
                    void editPort('apiHost', e.currentTarget.value)
                  }}
                />
              ) : (
                <span>{systemConfig.apiHost}</span>
              )}
              <img
                alt="bianji"
                src="assets/iconfont/bianji.svg"
                style={{ height: '1em', width: '1em' }}
                className="ml-2"
                onClick={() => {
                  setIsApiHostEditing(!isApiHostEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({ defaultMessage: 'API端口' })}
              className="w-20"
            >
              {isApiPortEditing ? (
                <Input
                  defaultValue={systemConfig.apiPort}
                  autoFocus
                  style={{ width: '300px', height: '24px', paddingLeft: '6px' }}
                  type="text"
                  onBlur={e => {
                    setIsApiPortEditing(!isApiPortEditing)
                    void editPort('apiPort', e.target.value)
                  }}
                  onPressEnter={e => {
                    setIsApiPortEditing(!isApiPortEditing)
                    void editPort('apiPort', e.currentTarget.value)
                  }}
                />
              ) : (
                <span>{systemConfig.apiPort}</span>
              )}
              <img
                alt="bianji"
                src="assets/iconfont/bianji.svg"
                style={{ height: '1em', width: '1em' }}
                className="ml-2"
                onClick={() => {
                  setIsApiPortEditing(!isApiPortEditing)
                }}
              />
            </Descriptions.Item>
            {/*<Descriptions.Item label="中间件端口:">*/}
            {/*  {isMidPortEditing ? (*/}
            {/*    <Input*/}
            {/*      defaultValue={systemConfig.middlewarePort}*/}
            {/*      autoFocus*/}
            {/*      type="text"*/}
            {/*      style={{ width: '300px', height: '24px', paddingLeft: '6px' }}*/}
            {/*      onBlur={e => {*/}
            {/*        setIsMidPortEditing(!isMidPortEditing)*/}
            {/*        void editPort('middlewarePort', e.target.value)*/}
            {/*      }}*/}
            {/*      onPressEnter={e => {*/}
            {/*        setIsMidPortEditing(!isMidPortEditing)*/}
            {/*        void editPort('middlewarePort', e.currentTarget.value)*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    <span>{systemConfig.middlewarePort}</span>*/}
            {/*  )}*/}
            {/*  <img alt="bianji" src="assets/iconfont/bianji.svg" style={{height:'1em', width: '1em'}}*/}
            {/*    className="ml-2"*/}
            {/*    onClick={() => {*/}
            {/*      setIsMidPortEditing(!isMidPortEditing)*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</Descriptions.Item>*/}
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: '日志水平' })}>
              <Radio.Group
                value={systemConfig.logLevel}
                onChange={e => {
                  onChange(e, 'logLevel')
                }}
              >
                <Radio value={1} className="mr-15 ">
                  info
                </Radio>
                <Radio value={2} className="mr-15">
                  debug
                </Radio>
                <Radio value={3}> error </Radio>
              </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: '开发环境' })}>
              <Radio.Group
                value={systemConfig.devSwitch}
                onChange={e => {
                  if (e.target.value) {
                    requests.post('/global', {
                      key: 'enableGraphQLEndpoint',
                      val: true
                    })
                  }
                  onChange(e, 'devSwitch')
                }}
              >
                <Radio value={true} className="mr-15">
                  <FormattedMessage defaultMessage="开发环境" />
                </Radio>
                <Radio value={false}>
                  <FormattedMessage defaultMessage="生产环境" />
                </Radio>
              </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: '调试' })}>
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
              <Descriptions.Item label={intl.formatMessage({ defaultMessage: '强制跳转' })}>
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
            <Alert
              message={intl.formatMessage({ defaultMessage: '修改设置后，请重新编译' })}
              type="warning"
              showIcon
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
