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
        <div className="logo" />
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
