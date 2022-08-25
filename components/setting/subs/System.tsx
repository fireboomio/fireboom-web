/* eslint-disable react-hooks/exhaustive-deps */

import type { RadioChangeEvent } from 'antd'
import { Descriptions, Divider, Radio, Switch, Input } from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './subs.module.scss'
dayjs.extend(duration)

interface systemConfig {
  apiPort: string
  debugSwitch: string
  devSwitch: string
  forcedJumpSwitch: string
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
  const [isApiPortEditing, setIsApiPortEditing] = useImmer(false)
  const [isMidPortEditing, setIsMidPortEditing] = useImmer(false)
  const [systemConfig, setSystemConfig] = useImmer({} as systemConfig)
  const [count, setCount] = useImmer(0)
  const [refreshFlag, setRefreshFlag] = useState<boolean>()

  useEffect(() => {
    void requests.get<unknown, systemConfig>('/setting/systemConfig').then(res => {
      setSystemConfig(res)
    })
  }, [refreshFlag])

  useEffect(() => {
    void requests
      .get<unknown, string>('/setting/getTime')
      .then(res => {
        console.log(res, 'res')
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
    void requests.post('/setting', { key: key, val: e.target.value as string }).then(() => {
      setRefreshFlag(!refreshFlag)
    })
  }

  const calTime = (initTime: string) => {
    // console.log(dayjs.duration(24, 'hours').humanize())
    const time = dayjs.duration(dayjs().diff(dayjs(initTime), 'seconds'), 'seconds') as unknown as {
      $d: Runtime
    }
    return `${time.$d.days}天 ${time.$d.hours}时 ${time.$d.minutes}分 ${time.$d.seconds}秒`
  }

  const editPort = (key: string, value: string) => {
    if (value == '') return
    void requests.post('/setting', { key: key, val: value }).then(() => {
      setRefreshFlag(!refreshFlag)
    })
  }
  return (
    <>
      <div>
        <Divider className={styles['divider-line']} />
        <div className="flex justify-center ml-5 ">
          <Descriptions
            colon={false}
            column={1}
            className={styles['descriptions-box']}
            labelStyle={{
              backgroundColor: 'white',
              width: '15%',
              borderRight: 'none',
              borderBottom: 'none',
              color: 'gray',
            }}
          >
            <Descriptions.Item label="运行时长:">
              {calTime(dayjs(count).format('YYYY-MM-DD HH:mm:ss'))}
            </Descriptions.Item>
            <Descriptions.Item label="API端口:" className="w-20">
              {isApiPortEditing ? (
                <Input
                  autoFocus
                  style={{ width: '80px', height: '24px', paddingLeft: '6px' }}
                  type="text"
                  onBlur={e => {
                    setIsApiPortEditing(!isApiPortEditing)
                    void editPort('apiPort', e.target.value)
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
                  autoFocus
                  type="text"
                  style={{ width: '80px', height: '24px', paddingLeft: '6px' }}
                  onBlur={e => {
                    setIsMidPortEditing(!isMidPortEditing)
                    void editPort('middlewarePort', e.target.value)
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
            <Descriptions.Item label="开发环境">
              <Radio.Group
                defaultValue={systemConfig.envType}
                onChange={e => {
                  onChange(e, 'envType')
                }}
              >
                <Radio value={'0'} className="mr-15">
                  开发环境
                </Radio>
                <Radio value={'1'}>生产环境</Radio>
              </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label="调试:">
              <Switch
                onChange={value => {
                  void requests.post('/setting', {
                    key: 'devSwitch',
                    val: value == false ? '0' : '1',
                  })
                }}
                defaultChecked={systemConfig.devSwitch == '1' ? true : false}
                className={styles['switch-edit-btn']}
                size="small"
              />
            </Descriptions.Item>
            <Descriptions.Item label="日志水平:">
              <Radio.Group
                defaultValue={systemConfig.logLevel}
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

            <Descriptions.Item label="强制跳转:">
              <Switch
                defaultChecked={systemConfig.forcedJumpSwitch == '1' ? true : false}
                className={styles['switch-edit-btn']}
                size="small"
                onChange={value => {
                  void requests.post('/setting', {
                    key: 'forcedJumpSwitch',
                    val: value == false ? '0' : '1',
                  })
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label=" ">
              <button className={styles['edit-btn']}>
                <span>重启</span>
              </button>
              <span className={styles.setTitle}>
                <IconFont type="icon-zhuyi" className="text-[14px]" />
                XXX已修改，请点击重启
              </span>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  )
}
