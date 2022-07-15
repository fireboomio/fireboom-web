import {
  InfoCircleOutlined,
  PauseCircleOutlined,
  PoweroffOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import { Descriptions, Divider, Radio, Switch, Button, Input } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './setting-main.module.scss'

//字段名少了运行时长 类型
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
  const [value, setValue] = useImmer(1)
  const [systemConfig, setSystemConfig] = useImmer({} as systemConfig)
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(e.target.value)
  }
  const getData = useCallback(async () => {
    const result = await requests.get<unknown, systemConfig>('/setting/systemConfig')
    console.log(result, '123')
    setSystemConfig(result)
  }, [])

  useEffect(() => {
    void getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editPort = async (key: string, value: string) => {
    if (value == '') return
    await requests.post('/setting', { key: key, val: value })
    void getData()
  }
  return (
    <>
      <div>
        <div className="ml-65 -mt-6">
          <Button type="text">
            <PoweroffOutlined />
            <span>开启</span>
          </Button>
          <Button type="text">
            <PauseCircleOutlined />
            <span>暂停</span>
          </Button>
        </div>
        <Divider type="horizontal" className="mt-1" />

        <div className="flex justify-center ml-5 ">
          <Descriptions
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
            <Descriptions.Item label="运行时长">23h34m</Descriptions.Item>
            <Descriptions.Item label="API端口">
              {isApiPortEditing ? (
                <Input
                  autoFocus
                  className="w-20 h-6 pl-1.5"
                  type="text"
                  onBlur={(e) => {
                    setIsApiPortEditing(!isApiPortEditing)
                    void editPort('apiPort', e.target.value)
                  }}
                />
              ) : (
                <span>{systemConfig.apiPort}</span>
              )}
              <EditOutlined
                className="ml-2"
                onClick={() => {
                  setIsApiPortEditing(!isApiPortEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="中间件端口">
              {isMidPortEditing ? (
                <Input
                  autoFocus
                  type="text"
                  className="w-20 h-6 pl-1.5"
                  onBlur={(e) => {
                    setIsMidPortEditing(!isMidPortEditing)
                    void editPort('middlewarePort', e.target.value)
                  }}
                />
              ) : (
                <span>{systemConfig.middlewarePort}</span>
              )}
              <EditOutlined
                className="ml-2"
                onClick={() => {
                  setIsMidPortEditing(!isMidPortEditing)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              <Radio.Group defaultValue="env" onChange={onChange} value={value}>
                <Radio value={1} className="mr-15 ">
                  info
                </Radio>
                <Radio value={2} className="mr-15">
                  debug
                </Radio>
                <Radio value={3}> error </Radio>
              </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label="开发者模式">
              <Switch
                checked={systemConfig.devSwitch == '1' ? true : false}
                className={styles['switch-edit-btn']}
                size="small"
              />
            </Descriptions.Item>
            <Descriptions.Item label="强制跳转">
              <Switch
                checked={systemConfig.forcedJumpSwitch == '1' ? true : false}
                className={styles['switch-edit-btn']}
                size="small"
              />
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div>
          <Button className={styles['edit-btn']}>
            <span>重启</span>
          </Button>
          <span className={styles.setTitle}>
            <InfoCircleOutlined />
            XXX已修改，请点击重启
          </span>
        </div>
      </div>
    </>
  )
}
