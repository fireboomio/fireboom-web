import { Divider, Layout as ALayout, Menu, Image } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { Info } from '@/interfaces/common'
import { DOMAIN } from '@/lib/common'
import requests from '@/lib/fetchers'

import styles from './layout.module.scss'
import Player from './player'
import StatusBar from './status-bar'
import Window from './window'

const { Sider, Content } = ALayout

interface BarOnce {
  version: string
  env: string
}

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
    icon: (
      <Link href={'/'}>
        <Image height={26} width={26} src="/assets/home_dark.svg" alt="主页" preview={false} />
      </Link>
    ),
    link: '/',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/home.svg" alt="主页" preview={false} />,
  },
  {
    title: '数据建模',
    icon: (
      <Link href={'/modeling'}>
        <Image
          height={26}
          width={26}
          src="/assets/modeling_dark.svg"
          alt="数据建模"
          preview={false}
        />
      </Link>
    ),
    link: '/modeling',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/modeling.svg" alt="数据建模" preview={false} />,
  },
  {
    title: '认证鉴权',
    icon: (
      <Link href={'/auth'}>
        <Image height={26} width={26} src="/assets/auth_dark.svg" alt="认证鉴权" preview={false} />
      </Link>
    ),
    link: '/auth',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/auth.svg" alt="认证鉴权" preview={false} />,
  },
  {
    title: '文件存储',
    icon: (
      <Link href={'/storage'}>
        <Image
          height={26}
          width={26}
          src="/assets/storage_dark.svg"
          alt="文件存储"
          preview={false}
        />
      </Link>
    ),
    link: '/storage',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/storage.svg" alt="文件存储" preview={false} />,
  },
  // {
  //   title: '数据来源',
  //   icon: <IconFont type="icon-chucun-weixuanzhong" />,
  //   link: '/datasource',
  //   position: 'top',
  //   svg: <Image  height={26} width={26} src="/assets/datasource.svg" alt="数据来源" preview={false} />,
  // },
  {
    title: 'API 管理',
    icon: (
      <Link href={'/apimanage'}>
        <Image height={26} width={26} src="/assets/api_dark.svg" alt="API 管理" preview={false} />
      </Link>
    ),
    link: '/apimanage',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/api.svg" alt="API 管理" preview={false} />,
  },
  {
    title: 'GraphQL',
    icon: (
      <Link href={'/graphiql'}>
        <Image
          height={26}
          width={26}
          src="/assets/graphiql_dark.svg"
          alt="GraphQL"
          preview={false}
        />
      </Link>
    ),
    link: '/graphiql',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/graphiql.svg" alt="GraphQL" preview={false} />,
  },
  {
    title: '帮助',
    icon: (
      <Link href={'/help'}>
        <Image height={26} width={26} src="/assets/help_dark.svg" alt="帮助" preview={false} />
      </Link>
    ),
    link: '/help',
    position: 'bottom',
    svg: <Image height={26} width={26} src="/assets/help.svg" alt="帮助" preview={false} />,
  },
  {
    title: '支持',
    icon: (
      <Link href={'/support'}>
        <Image height={26} width={26} src="/assets/support_dark.svg" alt="支持" preview={false} />
      </Link>
    ),
    link: '/support',
    position: 'bottom',
    svg: <Image height={26} width={26} src="/assets/support.svg" alt="支持" preview={false} />,
  },
  {
    title: '设置',
    icon: (
      <Link href={'/setting'}>
        <Image height={26} width={26} src="/assets/setting_dark.svg" alt="设置" preview={false} />
      </Link>
    ),
    link: '/setting',
    position: 'bottom',
    svg: <Image height={26} width={26} src="/assets/setting.png" alt="设置" preview={false} />,
  },
]

export default function Layout({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useRouter()
  const [info, setInfo] = useState<Info>()
  const [version, setVersion] = useState<string>('--')
  const [env, setEnv] = useState<string>('--')
  const [showWindow, setShowWindow] = useState(false)

  const windowStyle = useMemo(() => {
    const diff = collapsed ? '80px' : '200px'
    return { width: `calc(100vw - ${diff})` }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed])

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
    void requests.get<unknown, BarOnce>('/wdg/barOnce').then(res => {
      setVersion(res.version)
      setEnv(res.env)
    })
  }, [])

  useEffect(() => {
    void fetch(`${DOMAIN}/api/v1/wdg/state`).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) return

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void data.json().then(res => setInfo(res))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
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
      <Player className="fixed top-4 right-65 z-500" status={info?.engineStatus ?? '--'} />
      <Sider
        className={`${styles['sider']} h-full min-h-screen bg-[#FBFBFB] border`}
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

      <ALayout className="site-layout" style={{ height: '100vh' }}>
        <Content className="bg-white">{children}</Content>
        {showWindow ? (
          <Window style={windowStyle} toggleWindow={() => setShowWindow(!showWindow)} />
        ) : (
          <></>
        )}
        <Footer className={styles.footer}>
          <StatusBar
            version={version}
            env={env}
            errorInfo={info?.errorInfo}
            engineStatus={info?.engineStatus}
            hookStatus={info?.hookStatus}
            toggleWindow={() => setShowWindow(!showWindow)}
          />
        </Footer>
      </ALayout>
    </ALayout>
  )
}
