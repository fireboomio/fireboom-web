import { QuestionCircleOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { Divider, Layout as ALayout, Menu, Image } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import IconFont from '@/components/iconfont'
import { Status } from '@/interfaces/common'
import { DOMAIN } from '@/lib/common'

import styles from './layout.module.scss'
import Player from './player'
import StatusBar from './status-bar'

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
  // {
  //   title: '数据来源',
  //   icon: <IconFont type="icon-chucun-weixuanzhong" />,
  //   link: '/datasource',
  //   position: 'top',
  //   svg: <Image src="/assets/datasource.svg" alt="数据来源" preview={false} />,
  // },
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
    title: '帮助',
    icon: <QuestionCircleOutlined />,
    link: '/help',
    position: 'bottom',
    svg: <Image src="/assets/help.png" alt="帮助" preview={false} />,
  },
  {
    title: '支持',
    icon: <WhatsAppOutlined />,
    link: '/support',
    position: 'bottom',
    svg: <Image src="/assets/support.png" alt="支持" preview={false} />,
  },
  {
    title: '设置',
    icon: <IconFont type="icon-shezhi" />,
    link: '/setting',
    position: 'bottom',
    svg: <Image src="/assets/setting.png" alt="设置" preview={false} />,
  },
]

export default function Layout({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useRouter()
  const [status, setStatus] = useState<Status>('其他')

  const topMenuItems = useMemo(
    () =>
      menus
        .filter(m => m.position === 'top')
        .map(m => ({
          key: m.link,
          icon: m.link === pathname ? m.svg : m.icon,
          label: <Link href={m.link}>{m.title}</Link>,
        })),
    [pathname]
  )

  const bottomMenuItems = useMemo(
    () =>
      menus
        .filter(m => m.position === 'bottom')
        .map(m => ({
          key: m.link,
          icon: m.icon,
          label: <Link href={m.link}>{m.title}</Link>,
        })),
    []
  )

  useEffect(() => {
    void fetch(`${DOMAIN}/api/v1/wdg/state`).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) {
          return
        }

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)

          void data.json().then(res => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            setStatus(res.result)
          })
        } catch (error) {
          setStatus('其他')
          throw error
        }

        // @ts-ignore
        void reader.read().then(process)
      }

      // @ts-ignore
      void reader.read().then(process)
    })
  }, [])

  return (
    <ALayout>
      <Player className="fixed top-4 right-65 z-101" status={status} />
      <Sider
        className={`${styles['sider']} h-full min-h-screen bg-[#FBFBFB]`}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
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
          <Menu
            selectedKeys={[pathname]}
            className="bg-[#FBFBFB]"
            mode="inline"
            items={bottomMenuItems}
          />
        </div>
      </Sider>

      <ALayout className="site-layout">
        <Content className="bg-white">{children}</Content>
        <Footer className={styles.footer}>
          <StatusBar status={status} />
        </Footer>
      </ALayout>
    </ALayout>
  )
}
