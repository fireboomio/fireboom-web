import { Divider, Layout as ALayout, Menu, Image } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useState } from 'react'

import IconFont from '@/components/iconfont'

import styles from './layout.module.scss'

const { Sider, Content } = ALayout

const menus = [
  {
    title: '首页',
    icon: <IconFont type="icon-shouye-weixuanzhong" />,
    link: '/',
    position: 'top',
  },
  {
    title: '数据建模',
    icon: <IconFont type="icon-shujusheji-weixuanzhong" />,
    link: '/modeling',
    position: 'top',
  },
  {
    title: '认证鉴权',
    icon: <IconFont type="icon-shenfenyanzheng-weixuanzhong" />,
    link: '/auth',
    position: 'top',
  },
  {
    title: '文件存储',
    icon: <IconFont type="icon-chucun-weixuanzhong" />,
    link: '/storage',
    position: 'top',
  },
  {
    title: '数据来源',
    icon: <IconFont type="icon-chucun-weixuanzhong" />,
    link: '/datasource',
    position: 'top',
  },
  {
    title: 'API 管理',
    icon: <IconFont type="icon-API-weixuanzhong" />,
    link: '/apimanage',
    position: 'top',
  },
  {
    title: 'GraphQL',
    icon: <IconFont type="icon-QLweixuanzhong" />,
    link: '/graphiql',
    position: 'top',
  },
  { title: '个人资料', icon: <IconFont type=" " />, link: '/profile', position: 'bottom' },
  { title: '设置', icon: <IconFont type="icon-shezhi" />, link: '/setting', position: 'bottom' },
]

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

export default function Layout({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useRouter()

  return (
    <ALayout>
      <Sider
        className={`${styles['sider']} h-full min-h-screen bg-[#FBFBFB]`}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="flex items-center mx-6 my-5">
          <Link href="/">
            <a className="flex items-center">
              <Image width={36} height={36} src="/logo.png" alt="FireBoom" preview={false} />

              <span
                className={`${
                  collapsed ? styles['logo-label-collapsed'] : styles['logo-label']
                } ml-2 font-bold text-xl text-black`}
              >
                FireBoom
              </span>
            </a>
          </Link>
        </div>
        <Divider className={styles['sider-divider']} />

        <Menu
          selectedKeys={[pathname]}
          className="mt-10 bg-[#FBFBFB]"
          mode="inline"
          items={topMenuItems}
        />

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
