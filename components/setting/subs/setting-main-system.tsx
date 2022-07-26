/* eslint-disable react-hooks/exhaustive-deps */
import type { RadioChangeEvent } from 'antd'
import { Descriptions, Divider, Radio, Switch, Input } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './setting-main.module.scss'

interface systemConfig {
  apiPort: string
  debugSwitch: string
  devSwitch: string
  forcedJumpSwitch: string
  logLevel: string
  middlewarePort: string
}

export default function SettingMainVersion() {
  const [isApiPortEditing, setIsApiPortEditing] = useImmer(false)
  const [isMidPortEditing, setIsMidPortEditing] = useImmer(false)
  const [systemConfig, setSystemConfig] = useImmer({} as systemConfig)
  const onChange = (e: RadioChangeEvent) => {
    void requests.post('/setting', { key: 'logLevel', val: e.target.value as string })
    void getData()
  }

  const getData = useCallback(async () => {
    const result = await requests.get<unknown, systemConfig>('/setting/systemConfig')
    setSystemConfig(result)
  }, [])

  useEffect(() => {
    void getData()
  }, [])

  const editPort = async (key: string, value: string) => {
    if (value == '') return
    await requests.post('/setting', { key: key, val: value })
    void getData()
  }
  return (
    <>
      {systemConfig.apiPort ? (
        <div>
          <Divider type="horizontal" className="mt-1" />

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
              <Descriptions.Item label="运行时长:">{systemConfig.logLevel}</Descriptions.Item>
              <Descriptions.Item label="API端口:" className="w-20">
                {isApiPortEditing ? (
                  <Input
                    autoFocus
                    style={{ width: '80px', height: '24px', paddingLeft: '6px' }}
                    type="text"
                    onBlur={(e) => {
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
                    onBlur={(e) => {
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
              <Descriptions.Item label="类型:">
                <Radio.Group defaultValue={systemConfig.logLevel} onChange={onChange}>
                  <Radio value={'1'} className="mr-15 ">
                    info
                  </Radio>
                  <Radio value={'2'} className="mr-15">
                    debug
                  </Radio>
                  <Radio value={'3'}> error </Radio>
                </Radio.Group>
              </Descriptions.Item>
              <Descriptions.Item label="开发者模式:">
                <Switch
                  onChange={(value) => {
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
              <Descriptions.Item label="强制跳转:">
                <Switch
                  defaultChecked={systemConfig.forcedJumpSwitch == '1' ? true : false}
                  className={styles['switch-edit-btn']}
                  size="small"
                  onChange={(value) => {
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
      ) : (
        ''
      )}
    </>
  )
}
