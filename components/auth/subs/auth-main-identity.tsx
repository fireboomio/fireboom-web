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
const { TabPane } = Tabs

export default function AuthenticationMainIdentity() {
  const [authentication, setAuthentication] = useImmer({} as Authentication)
  const getStatus = useCallback(async () => {
    const res = await requests.get<unknown, Authentication>('/auth/hooksSwitch')
    setAuthentication(res)
    console.log(res)
  }, [])

  useEffect(() => {
    void getStatus()
  }, [])

  // const onChange = (key: string) => {
  //   // 调用hooksSwitch接口，默认调用postAuthenticationSwitch
  //   //await getStatus()
  //   if (key == '1') {
  //     postAuthenticationSwitch = authentication['postAuthenticationSwitch']
  //   } else {
  //     mutatingPostAuthenticationSwitch = authentication['mutatingPostAuthenticationSwitch']
  //   }
  // }
  // console.log(authentication[postAuthenticationSwitch])
  // console.log(authentication[mutatingPostAuthenticationSwitch])
  // void requests.post('/global', {
  //   key:
  //     'authentication[postAuthenticationSwitch]' |
  //     'authentication[mutatingPostAuthenticationSwitch]',
  //   val: 0,
  // })
  const postRequest = async (key: string, value: string | Array<string> | number) => {
    await requests.post('/global', {
      key: key,
      val: value,
    })
    void getStatus()
  }

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        // onChange={(key) => {
        // //  void onChange(key)
        // }}
      >
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
                  void postRequest('postAuthenticationSwitch', isChecked == false ? 0 : 1)
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
                  void postRequest('mutatingPostAuthenticationSwitch', isChecked == false ? 0 : 1)
                }}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </>
  )
}
