import {
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Switch, Tabs } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './auth-common-main.module.scss'

interface Authentication {
  postAuthenticationSwitch: boolean
  mutatingPostAuthenticationSwitch: boolean
}

interface Respones {
  authentication: Authentication
}

const { TabPane } = Tabs
export default function AuthenticationMainIdentity() {
  const [authentication, setAuthentication] = useImmer({} as Authentication)

  const postRequest = async (key: string, value: boolean | Authentication) => {
    await requests.post('/global', {
      key: key,
      val: value,
    })
    void getStatus()
  }

  const getStatus = useCallback(async () => {
    const data = await requests.get<unknown, Respones>('/auth/hooksSwitch')
    console.log(data, 'data')
    setAuthentication(data.authentication)
  }, [])

  useEffect(() => {
    void getStatus()
  }, [])
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="postAuthentication" key="1">
          <div className="flex justify-between items-center">
            <div className={styles.authHead}>
              <InfoCircleOutlined />
              <span>根据各种提供器选择逻辑，获取当前用户的角色</span>
            </div>
            <div className={`${styles.authBtn} flex items-center mr-2`}>
              <Button type="text" icon={<PlayCircleOutlined />}>
                测试
              </Button>
              <Button type="text" icon={<PlusCircleOutlined />}>
                添加
              </Button>
              <Button type="text" icon={<UnorderedListOutlined />}>
                管理
              </Button>
              <Button type="text" icon={<PlayCircleOutlined />}>
                选择
              </Button>
              <Switch
                checked={authentication.postAuthenticationSwitch}
                className={styles['switch-edit-btn']}
                size="small"
                onChange={(isChecked) => {
                  console.log(isChecked)
                  void postRequest('authentication', {
                    postAuthenticationSwitch: isChecked,
                    mutatingPostAuthenticationSwitch:
                      authentication.mutatingPostAuthenticationSwitch,
                  })
                  // console.log('postAuthenticationSwitch', authentication)
                }}
              />
            </div>
          </div>
        </TabPane>
        <TabPane tab="mutatingAuthentication" key="2">
          <div className="flex justify-between items-center">
            <div className={styles.authHead}>
              <InfoCircleOutlined />
              <span>根据各种提供器选择逻辑，获取当前用户的角色</span>
            </div>
            <div className={`${styles.authBtn} flex items-center mr-2`}>
              <Button type="text" icon={<PlayCircleOutlined />}>
                测试
              </Button>
              <Button type="text" icon={<PlusCircleOutlined />}>
                添加
              </Button>
              <Button type="text" icon={<UnorderedListOutlined />}>
                管理
              </Button>
              <Button type="text" icon={<PlayCircleOutlined />}>
                选择
              </Button>
              <Switch
                checked={authentication.mutatingPostAuthenticationSwitch}
                className={styles['switch-edit-btn']}
                size="small"
                onChange={(isChecked) => {
                  void postRequest('authentication', {
                    postAuthenticationSwitch: authentication.postAuthenticationSwitch,
                    mutatingPostAuthenticationSwitch: isChecked,
                  })
                }}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </>
  )
}
