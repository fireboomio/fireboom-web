import { AppleOutlined } from '@ant-design/icons'
import { Divider, Layout as ALayout, Menu, Image } from 'antd'
import Link from 'next/link'
import { PropsWithChildren, useState } from 'react'

import styles from './layout.module.scss'

const { Sider, Content } = ALayout

const menus = [
  { title: '模型', icon: <AppleOutlined />, link: '/modeling', position: 'top' },
  { title: '数据', icon: <AppleOutlined />, link: '/data', position: 'top' },
  { title: '用户', icon: <AppleOutlined />, link: '/user', position: 'top' },
  { title: '存储', icon: <AppleOutlined />, link: '/storage', position: 'top' },
  { title: 'GraphiQL', icon: <AppleOutlined />, link: '/graphiql', position: 'top' },
  { title: '个人资料', icon: <AppleOutlined />, link: '/profile', position: 'bottom' },
  { title: '设置', icon: <AppleOutlined />, link: '/setting', position: 'bottom' },
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
        className={`${styles['sider']} h-full min-h-screen bg-[#FBFBFB]`}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="flex items-center mx-7 my-5">
          <Link href="/">
            <a className="flex">
              <Image
                width={26}
                height={32}
                src="https://picsum.photos/26/32"
                alt="FireBoom"
                preview={false}
              />

              <span
                className={`${
                  collapsed ? styles['logo-label-collapsed'] : styles['logo-label']
                } ml-3 font-bold text-xl`}
              >
                FireBoom
              </span>
            </a>
          </Link>
        </div>
        <Divider className={styles['sider-divider']} />

        <Menu className="mt-10 bg-[#FBFBFB]" mode="inline" items={topMenuItems} />

        <div className="absolute w-full bottom-12">
          <Menu className="bg-[#FBFBFB]" mode="inline" items={bottomMenuItems} />
        </div>
      </Sider>

      <ALayout className="site-layout">
        <Content className="bg-white">{children}</Content>
      </ALayout>
    </ALayout>
  )
}
