import {
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Switch, Tabs } from 'antd'

import type { AuthProvResp } from '@/interfaces/auth'

import styles from './auth-common-main.module.scss'

interface Props {
  content: AuthProvResp
}

const { TabPane } = Tabs

const onChange = (key: string) => {
  console.log(key)
}

export default function AuthenticationMainIdentity({ content }: Props) {
  if (!content) {
    return <></>
  }

  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  return (
    <>
      <Tabs defaultActiveKey="1" onChange={onChange}>
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
                defaultChecked
                className={styles['switch-edit-btn']}
                size="small"
                onChange={connectSwitchOnChange}
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
                defaultChecked
                className={styles['switch-edit-btn']}
                size="small"
                onChange={connectSwitchOnChange}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </>
  )
}
