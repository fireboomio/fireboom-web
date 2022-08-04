import { Divider, Layout as ALayout, Menu, Image } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useMemo, useState } from 'react'

import IconFont from '@/components/iconfont'

import styles from './layout.module.scss'

const { Sider, Content } = ALayout

interface MenuT {
  title: string
  icon: React.ReactNode
  link: string
  position: string
  svg: React.ReactNode
}

const menus: MenuT[] = [
  {
    title: '首页',
    icon: <IconFont type="icon-shouye-weixuanzhong" />,
    link: '/',
    position: 'top',
    svg: <Image src="/assets/home.svg" alt="主页" preview={false} />,
  },
  {
    title: '数据建模',
    icon: <IconFont type="icon-shujusheji-weixuanzhong" />,
    link: '/modeling',
    position: 'top',
    svg: <Image src="/assets/modeling.svg" alt="数据建模" preview={false} />,
  },
  {
    title: '认证鉴权',
    icon: <IconFont type="icon-shenfenyanzheng-weixuanzhong" />,
    link: '/auth',
    position: 'top',
    svg: <Image src="/assets/auth.svg" alt="认证鉴权" preview={false} />,
  },
  {
    title: '文件存储',
    icon: <IconFont type="icon-chucun-weixuanzhong" />,
    link: '/storage',
    position: 'top',
    svg: <Image src="/assets/storage.svg" alt="文件存储" preview={false} />,
  },
  {
    title: '数据来源',
    icon: <IconFont type="icon-chucun-weixuanzhong" />,
    link: '/datasource',
    position: 'top',
    svg: <Image src="/assets/datasource.svg" alt="数据来源" preview={false} />,
  },
  {
    title: 'API 管理',
    icon: <IconFont type="icon-API-weixuanzhong" />,
    link: '/apimanage',
    position: 'top',
    svg: <Image src="/assets/apimanage.svg" alt="API 管理" preview={false} />,
  },
  {
    title: 'GraphQL',
    icon: <IconFont type="icon-QLweixuanzhong" />,
    link: '/graphiql',
    position: 'top',
    svg: <Image src="/assets/graphql.svg" alt="GraphQL" preview={false} />,
  },
  {
    title: '个人资料',
    icon: <IconFont type=" " />,
    link: '/profile',
    position: 'bottom',
    svg: <IconFont type=" " />,
  },
  {
    title: '设置',
    icon: <IconFont type="icon-shezhi" />,
    link: '/setting',
    position: 'bottom',
    svg: <IconFont type="icon-shezhi" />,
  },
]

export default function Layout({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useRouter()

  const topMenuItems = useMemo(
    () =>
      menus
        .filter((m) => m.position === 'top')
        .map((m) => ({
          key: m.link,
          icon: m.link === pathname ? m.svg : m.icon,
          label: <Link href={m.link}>{m.title}</Link>,
        })),
    [pathname]
  )

  const bottomMenuItems = useMemo(
    () =>
      menus
        .filter((m) => m.position === 'bottom')
        .map((m) => ({
          key: m.link,
          icon: m.icon,
          label: <Link href={m.link}>{m.title}</Link>,
        })),
    []
  )

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
              <Image width={36} height={36} src="/assets/logo.png" alt="FireBoom" preview={false} />

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
