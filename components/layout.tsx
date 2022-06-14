import React, { PropsWithChildren, useState } from 'react'
import { Divider, Layout as ALayout, Menu } from 'antd'
import { AppleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import styles from './layout.module.css'

const { Sider, Content } = ALayout

const menus = [
  { title: '模型', icon: <AppleOutlined />, link: '/modeling', position: 'top' },
  { title: '数据', icon: <AppleOutlined />, link: '/data', position: 'top' },
  { title: '用户', icon: <AppleOutlined />, link: '/user', position: 'top' },
  { title: '存储', icon: <AppleOutlined />, link: '/storage', position: 'top' },
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
        className={styles['sider-menu']}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Divider />

        <Menu theme="dark" mode="inline" items={topMenuItems} />

        <div className={styles['menu-bottom']}>
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
