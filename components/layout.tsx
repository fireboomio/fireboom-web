import { AppleOutlined } from '@ant-design/icons'
import { Divider, Layout as ALayout, Menu } from 'antd'
import Link from 'next/link'
import { PropsWithChildren, useState } from 'react'

const { Sider, Content } = ALayout

const menus = [
  { title: '模型', icon: <AppleOutlined />, link: '/modeling', position: 'top' },
  { title: '数据', icon: <AppleOutlined />, link: '/data', position: 'top' },
  { title: '用户', icon: <AppleOutlined />, link: '/user', position: 'top' },
  { title: '存储', icon: <AppleOutlined />, link: '/storage', position: 'top' },
  { title: 'GraphiQL', icon: <AppleOutlined />, link: '/graphiql', position: 'top' },
  { title: '个人资料', icon: <AppleOutlined />, link: '/profile', position: 'bottom' },
  { title: '设置', icon: <AppleOutlined />, link: '/setting', position: 'bottom' },
  { title: '帮助', icon: <AppleOutlined />, link: '#', position: 'bottom' },
]

export default function Layout({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false)

  const topMenuItems = menus
    .filter((m) => m.position === 'top')
    .map((m) => ({
      key: m.link,
      icon: m.icon,
      label: <Link href={m.link}>{m.title}</Link>,
    }))

  const bottomMenuItems = menus
    .filter((m) => m.position === 'bottom')
    .map((m) => ({
      key: m.link,
      icon: m.icon,
      label: <Link href={m.link}>{m.title}</Link>,
    }))

  return (
    <ALayout>
      <Sider
        className="h-full min-h-screen"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="flex justify-center pt-6 pb-6 border-b-1 border-solid border-white-500/50">
          <Link href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="27" viewBox="0 0 22 27">
              <image
                width="22"
                height="27"
                href="data:image/png;base64,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 AABmAAAAAAAAAEgAAAABAAAASAAAAAEAAAAHAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAIaSBwAW AAAAwAAAAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAAFgAAAAOgBAABAAAAGwAAAAAA AABBU0NJSQAAAFBpY3N1bSBJRDogODIyulOfkAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNi0x N1QwNDo1ODo0MSswMzowMFf+u9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDYtMTdUMDQ6NTg6 NDErMDM6MDAmowNrAAAAFXRFWHRleGlmOkNvbG9yU3BhY2UANjU1MzUzewBuAAAAJ3RFWHRleGlm OkNvbXBvbmVudHNDb25maWd1cmF0aW9uADEsIDIsIDMsIDBVpCO/AAAAE3RFWHRleGlmOkV4aWZP ZmZzZXQAMTAyc0IppwAAAB90RVh0ZXhpZjpFeGlmVmVyc2lvbgA0OCwgNTAsIDQ5LCA0ONKfiLoA AAAjdEVYdGV4aWY6Rmxhc2hQaXhWZXJzaW9uADQ4LCA0OSwgNDgsIDQ479kHawAAABd0RVh0ZXhp ZjpQaXhlbFhEaW1lbnNpb24AMjKRt1ZWAAAAF3RFWHRleGlmOlBpeGVsWURpbWVuc2lvbgAyNzxL e1wAAABodEVYdGV4aWY6VXNlckNvbW1lbnQANjUsIDgzLCA2NywgNzMsIDczLCAwLCAwLCAwLCA4 MCwgMTA1LCA5OSwgMTE1LCAxMTcsIDEwOSwgMzIsIDczLCA2OCwgNTgsIDMyLCA1NiwgNTAsIDUw t78AYgAAABd0RVh0ZXhpZjpZQ2JDclBvc2l0aW9uaW5nADGsD4BjAAAAAElFTkSuQmCC"
              />
            </svg>
          </Link>
        </div>
        <Divider />

        <Menu theme="dark" mode="inline" items={topMenuItems} />

        <div className="absolute w-full bottom-12">
          <Divider />
          <Menu theme="dark" mode="inline" items={bottomMenuItems} />
        </div>
      </Sider>
      <ALayout className="site-layout">
        <Content>{children}</Content>
      </ALayout>
    </ALayout>
  )
}
